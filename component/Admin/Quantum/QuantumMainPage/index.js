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
  AddEquipment
} from "pages/Quantum";
import { history } from "helpers";

export class QuantumMainPageClass extends Component {
  state = {
    //currentMenu: "/",
    ismenu: true,
  };

  handleMenuChange = async itemId => {
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
                    title: t("Work Order"),
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
            ) 
            : currentMenu == "/equipment" ? (
              <ListEquipment />
            )  : (
              <div>Loading..</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentMenu: state.appointment.SelectedQuantumMenu,
});

const mapDispatchToProps = dispatch => {
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
