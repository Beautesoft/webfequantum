import React, { Component } from "react";
import {
  NormalButton,
  NormalCheckbox,
  NormalInput,
  TableWrapper,
} from "component/common";
import { withTranslation } from "react-i18next";

import {
  CustomerClasses,
  NewCustomerClasses,
  ItemDepts,
  NewDepartmentaldiscounts,
} from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";
export default class CustomermasterdetailsClass extends Component {
  state = {
    code: null,
    desc: null,
    checked: true,
    customerDetails: [
      { label: "Code", divClass: "justify-content-end" },
      { label: "Department" },
      { label: "Discount" },
    ],
    List: [],
    discount: 0,
    deptcode: null,
  };
  componentDidMount = () => {
    this.Listofcustomerclass({});
    this.ListodDept({});
  };

  Listofcustomerclass = async () => {
    let { code } = this.state;
    await this.props.CustomerClasses().then(res => {
      console.log(res);

      if (res.length > 0) {
        code = res[res.length - 1].classCode;
        code = Number(code) + 1;
      } else {
        code = 10000;
      }
      this.setState({
        code,
      });
      console.log(code);
    });
  };

  ListodDept = async () => {
    this.updateState({ is_loading: true });
    await this.props.ItemDepts().then(res => {
      console.log(res);
      let { List } = this.state;
      for (let key of res) {
        List.push({ itmCode: key.itmCode, itmDesc: key.itmDesc, Discount: 0 });
      }
      console.log(List);
      this.setState({
        List,
        is_loading: false,
      });
      console.log(List.length);
    });
  };

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  temp = ({ target: { value, name } }) => {
    console.log(value, name);
    let { code, desc, checked } = this.state;
    if (name == "code") {
      code = value;
      this.setState({ code });
    }
    if (name == "desc") {
      desc = value;
      this.setState({ desc });
    }
    if (name == "checked") {
      checked = value;
      this.setState({ checked });
    }
  };
  finalcorporate = async () => {
    let { desc, code, checkd } = this.state;
    if (desc == null) {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      let newreason = {
        classCode: code,
        classDesc: desc,
        classIsactive: checkd,
        classProduct: 0,
        classService: 0,
      };
      await this.props
        .NewCustomerClasses(newreason)
        .then(data => {
          this.Listofcustomerclass();
        })
        .catch(e => console.log(e));
    }
  };
  handlediscount = ({ target: { value, name } }) => {
    let { List, discount, deptcode } = this.state;
    if (name == "discount") {
      discount = value;
      this.setState({ discount });
      for (let i = 0; i <= List.length - 1; i++) {
        if (List[i].itmCode == deptcode) {
          List[i].Discount = discount;
          this.setState({ List });
          this.handledepartmentdiscount();
        }
      }
    }
  };
  handleid = code => {
    let { deptcode } = this.state;
    deptcode = code;
    this.setState({ deptcode });
    console.log(deptcode);
  };
  handledepartmentdiscount = async () => {
    let { discount, deptcode, code } = this.state;
    if (discount != 0) {
      let newreason = {
        departmentid: deptcode,
        classid: code,
        discount: discount,
        isactive: null,
      };
      await this.props.NewDepartmentaldiscounts(newreason).then(data => {
        console.log("ss");
      });
    }
  };
  render() {
    let { t } = this.props;
    let { code, desc, checked, List, customerDetails, is_loading, discount } =
      this.state;
    return (
      <>
        <div className="col-md-12 d-flex align-items-center">
          <div className="detail d-flex">
            <p
              className="category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Master Data")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p
              className="sub-category"
              onClick={() => this.props.history.push("/admin/backend")}
            >
              {t("Customer Master ")}
            </p>
            <i className="icon-right mx-md-3"></i>
            <p className="sub-category">{t("Operation")}</p>
          </div>
        </div>
        <div className="container-fluid">
          <h5 className="mt-5">{t("Customer Class")}</h5>
          <div className="row">
            <div className="col-4">
              <div className="mt-3">
                <span>{t("Code")}</span>
                <span style={{ color: "red" }}>*</span>
                <div className="input-group">
                  <NormalInput
                    value={code}
                    name="code"
                    onChange={this.temp}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="mt-3 ">
                <span>{t("Description")}</span>
                <span style={{ color: "red" }}>*</span>
                <div className="input-group d-flex">
                  <div>
                    <NormalInput
                      value={desc}
                      name="desc"
                      onChange={this.temp}
                    />
                  </div>
                  <div className="ml-5">
                    <div className="d-flex input-group">
                      <NormalCheckbox
                        checked={checked}
                        name="checked"
                        onChange={this.temp}
                      />
                      <p>{t("Active")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 mt-1">
            <div className="tab-table-content">
              <div className="py-4">
                <div className="table-container">
                  <TableWrapper headerDetails={customerDetails}>
                    {is_loading ? (
                      <tr>
                        <td colSpan="7">
                          <div class="d-flex mt-5 align-items-center justify-content-center">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : List.length > 0 ? (
                      List.map(({ itmCode, itmDesc, Discount }, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="text-right">{itmCode}</div>
                            </td>
                            <td>
                              <div className="text-left">{itmDesc}</div>
                            </td>
                            <td>
                              <div
                                className="text-left"
                                onClick={() => this.handleid(itmCode)}
                              >
                                <NormalInput
                                  value={Discount}
                                  name="discount"
                                  onChange={this.handlediscount}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : null}
                  </TableWrapper>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3" style={{ width: 100 }}>
            <NormalButton
              mainbg={true}
              label={"Add"}
              onClick={() => this.finalcorporate()}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      CustomerClasses,
      NewCustomerClasses,
      ItemDepts,
      NewDepartmentaldiscounts,
    },
    dispatch
  );
};

export const Customermasterdetails = withTranslation()(
  connect(null, mapDispatchToProps)(CustomermasterdetailsClass)
);
