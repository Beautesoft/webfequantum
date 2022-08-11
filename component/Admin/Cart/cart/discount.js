import React, { Component } from "react";
import "./style.scss";
import {
  NormalButton,
  NormalInput,
  NormalSelect,
  NormalTextarea,
} from "component/common";
import { dateFormat } from "service/helperFunctions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  updateForm,
  commonUpdateApi,
  commonCreateApi,
} from "redux/actions/common";
import SimpleReactValidator from "simple-react-validator";

export class DiscountClass extends Component {
  state = {
    cartData: {},
    discountFields: {
      discount: 0,
      discount_amt: 0,
      disc_reason: "",
      discreason_txt: null,
    },
    discountReasonList: [],
  };

  componentWillMount = async () => {
    // this.getCart();
    console.log(this.props, "propsssssssssss");
    this.validator = new SimpleReactValidator({
      element: message => (
        <span className="error-message text-danger validNo fs14">
          {message}
        </span>
      ),
      autoForceUpdate: this,
    });
    await this.setState({
      cartData: this.props.cartData,
    });
    this.getDropdownData();

    this.getDataFromStore(this.props.cartData);
  };

  getDataFromStore = data => {
    let { discountFields } = this.state;
    console.log("fsdfgdfydfdfsg", data, this.props);
    discountFields["discount"] = data.discpercent;
    discountFields["discount_amt"] = data.discountamt;
    discountFields["disc_reason"] = data.discount_reason;
    discountFields["discreason_txt"] = data.discreason_txt;
    this.setState({
      discountFields,
    });
  };

  getDropdownData = () => {
    let { discountReasonList } = this.state;

    this.props.getCommonApi(`paymentremarks/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          discountReasonList.push({ value: value.id, label: value.r_desc });
        }
        this.setState({ discountReasonList });
      }
    });
  };

  getDateTime = data => {
    let date = new Date(data);
    date = String(date).split(" ");
    let date1 = date[2] + "th " + date[1] + ", " + date[3];
    let time = date[4].split(":");
    let time1 =
      String(Number(time[0]) > 12 ? Number(time[0]) - 12 : time[0]) +
      ":" +
      time[1] +
      (Number(time[0]) > 12 ? "PM" : "AM");
    return time1 + ", " + date1;
  };

  handleChangeDisc = async ({ target: { value, name } }) => {
    let { discountFields, cartData } = this.state;
    discountFields[name] = value;
    if (name === "discount") {
      discountFields["discount_amt"] = Number(
        (this.props.discount_price / 100) * value
      ).toFixed(2);
    }
    if (name === "discount_amt") {
      // discountFields['discount'] = (value/formFields['price'])*100
      discountFields["discount"] = 0;
    }
    if (name === "discount" && Number(value) !== 182) {
      discountFields["discreason_txt"] = "";
      this.setState({
        discountFields,
      });
    }
    await this.setState({
      discountFields,
    });
    // this.props.updateForm('customerDetail', formFields)
    // await this.props.updateForm('appointmentCustomerDetail', formFields)
  };

  handleUpdateDisc = async () => {
    let { discountFields } = this.state;

    if (this.validator.allValid()) {
      // discountFields['discount'] = discountFields['discount'];
      discountFields["discount_amt"] = parseFloat(
        discountFields["discount_amt"]
      ).toFixed(2);
      await this.setState({ discountFields });
      this.props
        .commonUpdateApi(
          `itemcart/${this.props.id}/?disc_add=1&disc_reset=0`,
          discountFields
        )
        .then(key => {
          let { status, data } = key;
          this.props.handleRefresh();
        });
    } else {
      this.validator.showMessages();
    }
  };

  handleResetDisc = async () => {
    let { discountFields } = this.state;
    await this.setState({ discountFields });

    this.props
      .commonUpdateApi(
        `itemcart/${this.props.id}/?disc_add=0&disc_reset=1`,
        discountFields
      )
      .then(key => {
        let { status, data } = key;
        this.props.handleRefresh();
      });
  };

  render() {
    let { discountFields } = this.state;
    let { discountReasonList } = this.state;
    return (
      <div className="row discount">
        <div className="col-4">
          <label className="text-left text-black common-label-text ">
            Discount %
          </label>
          <div className="input-group mb-2">
            <NormalInput
              // placeholder="Enter here"
              // options={siteList}
              value={discountFields.discount}
              name="discount"
              onChange={this.handleChangeDisc}
              className="customer-name"
            />
            {this.validator.message(
              "discount percentage",
              discountFields.discount,
              "required"
            )}
          </div>
        </div>
        <div className="col-4">
          <label className="text-left text-black common-label-text ">
            Discount amount
          </label>
          <div className="input-group mb-2">
            <NormalInput
              // placeholder="Enter here"
              // options={siteList}
              value={discountFields.discount_amt}
              name="discount_amt"
              onChange={this.handleChangeDisc}
              className="customer-name"
            />
            {this.validator.message(
              "discount amount",
              discountFields.discount_amt,
              "required"
            )}
          </div>
        </div>
        <div className="col-4">
          <label className="text-left text-black common-label-text ">
            Discount reason
          </label>
          <div className="input-group mb-2">
            <NormalSelect
              // placeholder="Enter here"
              options={discountReasonList}
              value={discountFields.disc_reason}
              name="disc_reason"
              onChange={this.handleChangeDisc}
              className="customer-name py-0"
            />
            {this.validator.message(
              "discount reason",
              discountFields.disc_reason,
              "required"
            )}
          </div>
        </div>
        {discountFields.disc_reason == "182" ? (
          <div className="col-12">
            <label className="text-left text-black common-label-text ">
              Discount reason
            </label>
            <div className="input-group mb-2">
              <NormalTextarea
                // placeholder="Enter here"
                // options={discountReasonList}
                value={discountFields.discreason_txt}
                name="discreason_txt"
                onChange={this.handleChangeDisc}
                className="customer-name py-0"
              />
              {this.validator.message(
                "discount reason",
                discountFields.discreason_txt,
                "required"
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="col-12 text-center d-flex apply">
          <NormalButton
            buttonClass={"mx-2"}
            applybg={true}
            className=" fs-15 confirm"
            label="Apply"
            onClick={this.handleUpdateDisc}
          />

          <NormalButton
            buttonClass={"mx-2"}
            resetbg={true}
            className=" fs-15 reset"
            label="Reset"
            onClick={this.handleResetDisc}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selected_cstomer: state.common.selected_cstomer,
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      // getCustomer,
      getCommonApi,
      updateForm,
      commonUpdateApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const Discount = connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscountClass);
