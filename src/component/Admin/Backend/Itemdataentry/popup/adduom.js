import React, { Component } from "react";
import { NormalButton, NormalInput, NormalSelect } from "component/common";
import { withTranslation } from "react-i18next";
import { ItemUom, NewItemUomprices } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export class NewuompopupClass extends Component {
  state = {
    UOMC: [],
    UOM: [],
    count: null,
    uom_res: null,
    uomc_res: null,
  };
  componentDidMount = () => {
    this.listuoms({});
  };

  updateState = (data) => {
    if (this.state.isMounted) this.setState(data);
  };

  listuoms = async () => {
    let { UOMC, UOM } = this.state;
    UOMC = [];
    UOM = [];
    await this.props.ItemUom().then((res) => {
      for (let key of res) {
        UOMC.push({ value: key.uomCode, label: key.uomDesc });
        UOM.push({ value: key.uomCode, label: key.uomDesc });
      }
      console.log(UOMC);
      this.setState({
        UOMC,
        UOM,
      });
      console.log(UOMC.length);
    });
  };

  handleinput = ({ target: { value, name } }) => {
    console.log(value, name);
    let { count, uom_res, uomc_res } = this.state;
    if (name == "UOMC") {
      uomc_res = value;
      this.setState({ uomc_res });
    }
    if (name == "UOM") {
      uom_res = value;
      this.setState({ uom_res });
    }
    if (name == "unit") {
      count = value;
      this.setState({ count });
    }
  };

  handlesubmit = async () => {
    let { count, uom_res, uomc_res } = this.state;
    if (count == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newlist = {
        itemCode: "",
        itemUom: uomc_res,
        uomDesc: uomc_res,
        uomUnit: count,
        itemUom2: uom_res,
        uom2Desc: uom_res,
        itemPrice: 0,
        itemCost: 0,
        minMargin: 0,
        isactive: true,
        itemUompriceSeq: 0,
        deleteUser: "",
        deleteDate: new Date(),
      };
      await this.props
        .NewItemUomprices(newlist)
        .then((data) => {})

        .catch((e) => console.log(e));

      this.props.handleModal();
      this.props.listofuom();
    }
  };

  render() {
    let { UOMC, count, UOM, uom_res, uomc_res } = this.state;
    return (
      <div>
        <h6>Add UOM</h6>
        <div className="d-flex mt-3">
          <div className="col-4 mt-3">
            <p>UOMC Description</p>
            <NormalSelect
              options={UOMC}
              value={uomc_res}
              name="UOMC"
              onChange={this.handleinput}
            />
          </div>

          <div className="col-4 mt-3">
            <span>UOM Unit</span>
            <span style={{ color: "red" }}>*</span>
            <NormalInput
              onChange={this.handleinput}
              value={count}
              type="number"
              name="unit"
            />
          </div>
          <div className="col-4 mt-3">
            <p>UOM Description</p>
            <NormalSelect
              options={UOM}
              value={uom_res}
              name="UOM"
              onChange={this.handleinput}
            />
          </div>
        </div>
        <div className="d-flex mt-3 justify-content-between">
          <div className="pl-2">
            <NormalButton
              mainbg={true}
              label={"Cancel"}
              onClick={() => this.props.handleModal()}
            />
          </div>
          <div className="pr-2">
            <NormalButton
              mainbg={true}
              label={"Submit"}
              onClick={() => this.handlesubmit()}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      ItemUom,
      NewItemUomprices,
    },
    dispatch
  );
};
export const Newuompopup = withTranslation()(
  connect(null, mapDispatchToProps)(NewuompopupClass)
);
