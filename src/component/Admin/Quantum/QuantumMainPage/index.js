import React, { Component } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";

import { withTranslation } from "react-i18next";
import { Navigation } from "react-minimal-side-navigation";
import { CgMenuLeft } from "react-icons/cg";
import {
  updateForm,
  getSelectedTreatmentList,
} from "redux/actions/appointment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";

import {
  ListPO,
  AddPO,
  ListQuotation,
  AddQuotation,
  ListWorkOrderInvoice,
  ManualListQuotation,
  ListDeliveryOrderModule,
  AddDeliveryOrder,
  ListEquipment,
  AddEquipment,
} from "pages/Quantum";
import { history } from "helpers";
import {xero} from "../xero_variable";

export class QuantumMainPageClass extends Component {
  state = {
    //currentMenu: "/",
    ismenu: true,
  };

  getQueryStringValues(key) {
    let code = "";
    const params = new URLSearchParams(window.location.search);
    for (const param of params) {
      console.log(param);
      if (param[0] == key) {
        code = param[1];
      }
    }

    return code;
  }

  utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

  getTokenApiXero = async () => {
    try {
      const res = await axios.post(
        "https://identity.xero.com/connect/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: `${this.getQueryStringValues("code")}`,
          redirect_uri: xero.redirectUrl,
        }),
        {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            authorization: `Basic ${this.utf8_to_b64(
              `${xero.clientId}:${xero.clientSecret}`
            )}`,
          },
        }
      );
      if (res.status == 200) {
        localStorage.setItem("accessTokenXero", res.data.access_token);
        fetch("/connections", {
          headers: {
            Authorization: `Bearer ${res.data.access_token}`,
            mode: "no-cors",
          },
        })
          .then((response) => response.json())
          .then((e) => {
            console.log(e, "Inside Connection Xero");
            localStorage.setItem("tenantIdXero", e[0].tenantId);
          })
          .catch((e) => console.log(e, "error inside connection xero"));
      }
      console.log(res, "INside token api of xer🔴🔴🔴");
    } catch (error) {
      alert("Session Expired! Please Reconnect with Xero");
      console.log(error, "error INside token api of xer🔴🔴🔴");
    }
  };
  componentDidMount() {
    if (window.location.href.includes("?")) {
      console.log(this.getQueryStringValues("code"));

      this.getTokenApiXero();
    } else {
      console.log("Iam Working");
    }
  }

  handleMenuChange = async (itemId) => {
    // this.setState({
    //   currentMenu: itemId,
    // });
    await this.props.updateForm("SelectedQuantumMenu", itemId);
  };

  handlemenuoption = () => {
    this.setState({
      ismenu: !this.state.ismenu,
    });
  };

  render() {
    let { ismenu } = this.state;
    let { currentMenu } = this.props;
    let { t } = this.props;
    return (
      <div className="row">
        <div className={ismenu == true ? "col-md-2 mt-3" : "mt-3"}>
          <div className="d-flex">
            {ismenu == true ? (
              <Navigation
                className="fs-13"
                activeItemId={currentMenu}
                onSelect={({ itemId }) => this.handleMenuChange(itemId)}
                items={[
                  {
                    title: t("PO"),
                    itemId: "/",
                  },
                  {
                    title: t("Quotation"),
                    itemId: "/Quotation",
                  },
                  {
                    title: t("Manual Invoice"),
                    itemId: "/manualinvoice",
                  },
                  {
                    title: t("Work Order Invoice"),
                    itemId: "/workorderinvoice",
                  },
                  {
                    title: t("Delivery Order "),
                    itemId: "/deliveryorder",
                  },
                  {
                    title: t("Equipment Order "),
                    itemId: "/equipment",
                  },
                ]}
              />
            ) : null}
          </div>
        </div>
        <div className={ismenu == true ? "col-md-10 mt-3" : "col-md-12 mt-3"}>
          <div className="row">
            {currentMenu == "/" ? (
              <ListPO />
            ) : currentMenu == "/Quotation" ? (
              <ListQuotation />
            ) : currentMenu == "/manualinvoice" ? (
              <ManualListQuotation />
            ) : currentMenu == "/workorderinvoice" ? (
              <ListWorkOrderInvoice />
            ) : currentMenu == "/deliveryorder" ? (
              <ListDeliveryOrderModule />
            ) : currentMenu == "/equipment" ? (
              <ListEquipment />
            ) : (
              <div>Loading..</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentMenu: state.appointment.SelectedQuantumMenu,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateForm,
    },
    dispatch
  );
};

export const QuantumMainPage = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(QuantumMainPageClass)
);
