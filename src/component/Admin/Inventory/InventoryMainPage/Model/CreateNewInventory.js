import React, { Component } from "react";
import {
  getCommonApi,
  commonCreateApi,
  commonPatchApi,
} from "redux/actions/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  NormalButton,
  NormalModal,
  NormalInput,
  TableWrapper,
  NormalDate,
  NormalTextarea,
} from "component/common";
import closeIcon from "assets/images/close.png";
import { Toast } from "service/toast";
import SimpleReactValidator from "simple-react-validator";
import { StockItemUsagePopup } from "./StockItemUsagePopup";
import { StockMemoStaffList } from "./StockMemoStaffList";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { createLogger } from "redux-logger";

export class CreateNewInventoryClass extends Component {
  state = {
    formFields: {
      itemName: "",
      emp_id: 0,
      employeeName: "",
      date: new Date(),
      stock_id: 0,
      qty: "",
      uom: "",
      memo_remarks: "",
    },
    isStockItemUsagePopup: false,
    isStockItemUsageEmployeePopup: false,
  };

  componentWillMount = () => {
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message font-md">{message}</span>
      ),
      autoForceUpdate: this,
    });
  };

  handleChange = async ({ target: { value, name } }) => {
    let { formFields } = this.state;
    formFields[name] = value;
    await this.setState({
      formFields,
    });
  };
  handleStockItemUsagePopup = () => {
    this.setState(prevState => ({
      isStockItemUsagePopup: !prevState.isStockItemUsagePopup,
    }));
  };
  handleStockItemUsageEmployeePopup = () => {
    this.setState(prevState => ({
      isStockItemUsageEmployeePopup: !prevState.isStockItemUsageEmployeePopup,
    }));
  };
  includeNewItems = async data => {
    this.handleStockItemUsagePopup();
    let { formFields } = this.state;
    formFields["qty"] = data.qty;
    formFields["uom"] = data.uom;
    formFields["stock_id"] = data.stock_id;
    formFields["itemName"] = data.ItemDesc;
    // ItemDesc: "FIRE DRAGON ESS OIL 火龙液 (5ML)";
    // item_code: "23000002";
    // link_code: "";
    // qty: "5";
    // stock_id: 5990;
    // uom: "BOX";
    // uom_id: 5615;
    await this.setState({ formFields });
  };

  handleSelectedStaff = async data => {
    this.handleStockItemUsageEmployeePopup();
    let { formFields } = this.state;
    formFields["emp_id"] = data.id;
    formFields["employeeName"] = data.emp_name;
    // emp_id: 0,
    // employeeName: "",
    await this.setState({ formFields });
  };

  handleSaveClick = () => {
    let { formFields } = this.state;

    if (this.validator.allValid()) {
      let data = {
        date: dateFormat(formFields.date),
        stock_id: formFields.stock_id,
        emp_id: formFields.emp_id,
        qty: Number(formFields.qty),
        uom: formFields.uom,
        memo_remarks: formFields.memo_remarks,
      };
      this.props.commonCreateApi(`stockusagememo/`, data).then(async res => {
        if (res.status === 201) {
          this.props.handleCreateNewSave();
        }
      });
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    let { formFields, isStockItemUsagePopup, isStockItemUsageEmployeePopup } =
      this.state;
    return (
      <NormalModal
        className={"select-category"}
        style={{ minWidth: "60%" }}
        modal={this.props.isCreateNewInventoryPopup}
        handleModal={this.props.handleCreateNewPopup}
      >
        <img
          onClick={this.props.handleCreateNewPopup}
          className="close"
          src={closeIcon}
          alt=""
        />
        <div className="d-flex h4 justify-content-center p-3">Stock Usage</div>
        <div className="row p-3">
          <div className="col-4 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Item Name
                <span className="error-message text-danger validNo fs-16">
                  *
                </span>
              </label>
            </div>
            <div className="input-group">
              <NormalInput
                value={formFields.itemName}
                name="itemName"
                onClick={() => this.handleStockItemUsagePopup()}
              />
            </div>
            {this.validator.message(
              "Item Name",
              formFields.itemName,
              "required"
            )}
          </div>

          <div className="col-4 mb-3">
            <label className="text-left text-black common-label-text ">
              Qty
              <span className="error-message text-danger validNo fs-16">*</span>
            </label>
            <div className="input-group">
              <NormalInput
                value={formFields.qty}
                name="qty"
                onChange={this.handleChange}
              />
            </div>
            {this.validator.message(
              "Quantity",
              formFields.qty,
              "not_in: 0|integer|required"
            )}
          </div>

          <div className="col-4 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                UOM
                <span className="error-message text-danger validNo fs-16">
                  *
                </span>
              </label>
            </div>
            <div className="input-group">
              <NormalInput
                //options={channelList}
                value={formFields.uom}
                name="uom"
                onChange={this.handleChange}
                disabled
              />
            </div>
            {this.validator.message("Unit", formFields.uom, "required")}
          </div>
          <div className="col-4 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Staff Name
                <span className="error-message text-danger validNo fs-16">
                  *
                </span>
              </label>
            </div>
            <div className="input-group">
              <NormalInput
                value={formFields.employeeName}
                name="employeeName"
                onClick={() => this.handleStockItemUsageEmployeePopup()}
              />
            </div>
            {this.validator.message(
              "Staff Name",
              formFields.employeeName,
              "required"
            )}
          </div>
          <div className="col-4 mb-3">
            <label className="text-left text-black common-label-text ">
              Date
            </label>
            <div className="">
              <NormalDate
                value={new Date(formFields.date)}
                name="date"
                type="date"
                onChange={this.handleChange}
                showDisabledMonthNavigation
              />
            </div>
          </div>
          <div className="col-4 mb-3">
            <div>
              <label className="text-left text-black common-label-text ">
                Remark
              </label>
            </div>
            <div className="input-group">
              <NormalTextarea
                value={formFields.memo_remarks}
                name="memo_remarks"
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="d-flex justify-content-end w-100">
            <NormalButton
              buttonClass={"col-3"}
              mainbg={true}
              className="col-12 ml-4 fs-15 "
              label="Save"
              onClick={this.handleSaveClick}
            />
            <NormalButton
              buttonClass={"col-3"}
              resetbg={true}
              className="col-12 ml-4 fs-15 "
              label="Cancel"
              onClick={this.props.handleCreateNewPopup}
            />
          </div>

          {isStockItemUsagePopup ? (
            <StockItemUsagePopup
              isStockItemUsagePopup={isStockItemUsagePopup}
              handleStockItemUsagePopup={this.handleStockItemUsagePopup}
              newItem={StockItemUsageList =>
                this.includeNewItems(StockItemUsageList)
              }
            />
          ) : null}
          {isStockItemUsageEmployeePopup ? (
            <StockMemoStaffList
              isStockItemUsageEmployeePopup={isStockItemUsageEmployeePopup}
              handleStockItemUsageEmployeePopup={
                this.handleStockItemUsageEmployeePopup
              }
              handleSelectedStaff={data => this.handleSelectedStaff(data)}
            />
          ) : null}
        </div>
      </NormalModal>
    );
  }
}

const mapStateToProps = state => ({
  // filter: state.dashboard
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
      commonPatchApi,
    },
    dispatch
  );
};

export const CreateNewInventory = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewInventoryClass);
