import React, { Component } from "react";
import { NormalButton } from "component/common";
import { ItemMaster } from "./Item master/index";
import { CgMenuLeft } from "react-icons/cg";
import { Navigation } from "react-minimal-side-navigation";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Division } from "./Itemclassification/Division";
import { Departmentlist } from "./Itemclassification/Department/index";
import { Itemclasslist } from "./Itemclassification/Itemclass/index";
import { Brandlist } from "./Itemclassification/Brand/index";
import { ItemUOM } from "./Itemclassification/UOM/index";
import { Commissionlist } from "./Itemclassification/Commission/index";
import { Itemclassproduct } from "./Itemclassification/Range/Product/index";
import { Itemclassservice } from "./Itemclassification/Range/Service/index";
import { Itemclassvoucher } from "./Itemclassification/Range/Voucher/index";
import { Itemclassprepaid } from "./Itemclassification/Range/Prepaid/index";
import { Itemclasscompound } from "./Itemclassification/Range/Compound/index";
import { Equipment } from "./Appointment Config/Equipments/index";
import { AppointmentRoom } from "./Appointment Config/Room/index";
import { Appointmentblockreason } from "./Appointment Config/Appoinmentreason/index";
import { Appointmentgroup } from "./Appointment Config/Appointmentgroup/index";
import { Appointmentchannel } from "./Appointment Config/Channel/index";
import { Bookingstatus } from "./Appointment Config/Bookingstatus/index";
import { Secondarystatus } from "./Appointment Config/Secondarystatus/index";
import { Adjustmentreason } from "./Treatment/Adjusmentreason/index";
import { Diagnosis } from "./Treatment/Diagnosis/index";
import { Itemstatusgroup } from "./Sales/ItemStatusgroup/index";
import { Itemstatus } from "./Sales/Item Status/index";
import { Discountreason } from "./Sales/Discount reason/index";
import { FOCreason } from "./Sales/FOC reason/index";
import { PaymentGroup } from "./Sales/PaymentGroup/index";
import { PaymentType } from "./Sales/Payment Type/index";
import { OccupationType } from "./Config Interface/Occupation Type/index";
import { Configsource } from "./Config Interface/Source/index";
import { Transactionreason } from "./Config Interface/Transaction Reason/index";
import { Transactionvoid } from "./Config Interface/Void Transaction";
import { Businesshours } from "./Business hours/index";
import { Taxtype } from "./Tax type";
import { Outletmaster } from "./Outlet master";
import { Customermasterone } from "./Customer Master I";
import { Customermastertwo } from "./Customer Master II";
import { Normalrewardpolicy } from "./Normal Reward Policy";
import { Redeempolicy } from "./Redeem Policy";
import { BonusReward } from "./Bonus Reward";
import { Vendormaster } from "./Vendor Master";
import { Countrysetting } from "./Country Setting";
import { Employeemaster } from "./Employee master";
import { Securitymaster } from "./Security master";
import { getTokenDetails } from "redux/actions/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

export default class BackendClass extends Component {
  state = {
    currentMenu: "/",
    ismenu: false,
  };

  handleMenuChange = (itemId) => {
    this.setState({
      currentMenu: itemId,
    });
    console.log(itemId);
  };

  handlemenuoption = () => {
    this.setState({
      ismenu: !this.state.ismenu,
    });
  };
  render() {
    let { currentMenu, ismenu } = this.state;
    let { t } = this.props;
    console.log(this.props.tokenDetails);
    return (
      <div className="container-fluid itemmaster-container">
        <div className="row mb-4">
          <div className="col-md-4 col-lg-2 mb-2">
            <Link to="#">
              <NormalButton
                normal={true}
                className="col-12 fs-15 float-right"
                label={t("Master Data")}
              />
            </Link>
          </div>
          <div className="col-md-4 col-lg-2 mb-2">
            <Link to="/admin/backend/Inventory">
              <NormalButton
                normal={true}
                className="col-12 fs-15 float-right"
                label={t("Inventory")}
              />
            </Link>
          </div>
          <div className="mt-2 col-md-8 d-flex justify-content-end">
            <h4 className="head-label">
              {" "}
              <span>Control site: </span>
              <span> {this.props.tokenDetails.controlsite}</span>
            </h4>
          </div>
        </div>
        <div className="row">
          <div className={ismenu == true ? "col-md-2 mt-5" : "mt-5"}>
            <div className="d-flex">
              {ismenu == true ? (
                <Navigation
                  activeItemId="/"
                  onSelect={({ itemId }) => this.handleMenuChange(itemId)}
                  items={[
                    {
                      title: t("Item Master"),
                      itemId: "/",
                    },
                    {
                      title: t("Item Classification"),
                      itemId: "/Item-Classification",
                      subNav: [
                        {
                          title: "Divison",
                          itemId: "/Item-Classification/division",
                        },
                        {
                          title: "Department",
                          itemId: "/Item-Classification/department",
                        },
                        {
                          title: t("Class"),
                          itemId: "/Item-Classification/class",
                        },
                        {
                          title: t("Brand"),
                          itemId: "/Item-Classification/brand",
                        },
                        {
                          title: t("UOM"),
                          itemId: "/Item-Classification/uom",
                        },
                        {
                          title: t("Commission"),
                          itemId: "/Item-Classification/commisssion",
                        },
                      ],
                    },
                    {
                      title: t("Range"),
                      itemId: "/Item-Classification/range",
                      subNav: [
                        {
                          title: "product",
                          itemId: "/Item-Classification/range/product",
                        },
                        {
                          title: "Service",
                          itemId:
                            "/Item-Classification/department/range/service",
                        },
                        {
                          title: t("Voucher"),
                          itemId: "/Item-Classification/range/voucher",
                        },
                        {
                          title: t("Prepaid"),
                          itemId: "/Item-Classification/range/prepaid",
                        },
                        {
                          title: t("Compound"),
                          itemId: "/Item-Classification/range/compound",
                        },
                      ],
                    },
                    {
                      title: t("Appointment Config"),
                      itemId: "/Appointmentconfig",
                      subNav: [
                        {
                          title: "Equipment",
                          itemId: "/Appointmentconfig/equiment",
                        },
                        {
                          title: "Room",
                          itemId: "/Appointmentconfig/room",
                        },
                        {
                          title: "Appointment Block Reason",
                          itemId: "/Appointmentconfig/abr",
                        },
                        {
                          title: t("Appointment Group"),
                          itemId: "/Appointmentconfig/appointg",
                        },
                        {
                          title: t("Booking Status"),
                          itemId: "/Appointmentconfig/booking",
                        },
                        {
                          title: t("Channel"),
                          itemId: "/Appointmentconfig/channel",
                        },
                        {
                          title: t("Secondary Status"),
                          itemId: "/Appointmentconfig/secstatus",
                        },
                      ],
                    },
                    {
                      title: t("Treatment"),
                      itemId: "/treatment",
                      subNav: [
                        {
                          title: "Adjustment Reason",
                          itemId: "/treatment/reason",
                        },
                        {
                          title: "Diagnosis ",
                          itemId: "/treatment/diagnosis",
                        },
                      ],
                    },
                    {
                      title: t("Sales"),
                      itemId: "/sales",
                      subNav: [
                        {
                          title: "Item Status Group",
                          itemId: "/sales/itemsSG",
                        },
                        {
                          title: "Item Status",
                          itemId: "/sales/item status",
                        },
                        {
                          title: "Discount Reason",
                          itemId: "/sales/discount reason",
                        },
                        {
                          title: t("FOC Reason"),
                          itemId: "/sales/foc reason",
                        },
                        {
                          title: t("Payment Group"),
                          itemId: "/sales/payment group",
                        },
                        {
                          title: t("Payment Type"),
                          itemId: "/sales/payment type",
                        },
                      ],
                    },
                    {
                      title: t("Config Interface"),
                      itemId: "/config interface",
                      subNav: [
                        {
                          title: "Occupation Type",
                          itemId: "/config interface/occupation",
                        },
                        {
                          title: "Source",
                          itemId: "/config interface/source",
                        },
                        {
                          title: "Transaction",
                          itemId: "/config interface/transaction",
                        },
                        {
                          title: t("VOID Transaction Reason"),
                          itemId: "/config interface/void transaction",
                        },
                      ],
                    },
                    {
                      title: t("Business Hours"),
                      itemId: "/Business hours",
                    },
                    {
                      title: t("Tax Type"),
                      itemId: "/Tax type",
                    },
                    {
                      title: t("Outlet Master"),
                      itemId: "/Outlet master",
                    },
                    {
                      title: t("Customer   Master-I"),
                      itemId: "/Customer master",
                    },
                    {
                      title: t("Customer   Master-II"),
                      itemId: "/Customer masterII",
                    },
                    {
                      title: t("Normal Reward Policy"),
                      itemId: "/normal reward policy",
                    },
                    {
                      title: t("Redeem Policy"),
                      itemId: "/redeem policy",
                    },
                    {
                      title: t("Bonus Reward"),
                      itemId: "/bonus reward",
                    },
                    {
                      title: t("Vendor Master"),
                      itemId: "/vendor master",
                    },
                    {
                      title: t("Country Setting"),
                      itemId: "/country setting",
                    },
                    {
                      title: t("Employee Master"),
                      itemId: "/employee master",
                    },
                    {
                      title: t("Security Master"),
                      itemId: "/security master",
                    },
                  ]}
                />
              ) : null}
            </div>
          </div>
          <div className={ismenu == true ? "col-md-10 mt-5" : "col-md-12 mt-5"}>
            <div className="d-flex">
              <CgMenuLeft size={30} onClick={() => this.handlemenuoption()} />
              {currentMenu == "/" ? (
                <ItemMaster history={this.props.history} />
              ) : currentMenu == "/Item-Classification/division" ? (
                <Division history={this.props.history} />
              ) : currentMenu == "/Item-Classification/department" ? (
                <Departmentlist history={this.props.history} />
              ) : currentMenu == "/Item-Classification/class" ? (
                <Itemclasslist history={this.props.history} />
              ) : currentMenu == "/Item-Classification/brand" ? (
                <Brandlist history={this.props.history} />
              ) : currentMenu == "/Item-Classification/uom" ? (
                <ItemUOM history={this.props.history} />
              ) : currentMenu == "/Item-Classification/commisssion" ? (
                <Commissionlist history={this.props.history} />
              ) : currentMenu == "/Item-Classification/range" ? (
                <Itemclassproduct history={this.props.history} />
              ) : currentMenu ==
                "/Item-Classification/department/range/service" ? (
                <Itemclassservice history={this.props.history} />
              ) : currentMenu == "/Item-Classification/range/voucher" ? (
                <Itemclassvoucher history={this.props.history} />
              ) : currentMenu == "/Item-Classification/range/prepaid" ? (
                <Itemclassprepaid history={this.props.history} />
              ) : currentMenu == "/Item-Classification/range/compound" ? (
                <Itemclasscompound history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig/equiment" ? (
                <Equipment history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig/room" ? (
                <AppointmentRoom history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig/abr" ? (
                <Appointmentblockreason history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig/appointg" ? (
                <Appointmentgroup history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig/channel" ? (
                <Appointmentchannel history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig/booking" ? (
                <Bookingstatus history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig/secstatus" ? (
                <Secondarystatus history={this.props.history} />
              ) : currentMenu == "/treatment" ? (
                <Adjustmentreason history={this.props.history} />
              ) : currentMenu == "/treatment/diagnosis" ? (
                <Diagnosis history={this.props.history} />
              ) : currentMenu == "/sales/itemsSG" ? (
                <Itemstatusgroup history={this.props.history} />
              ) : currentMenu == "/sales/item status" ? (
                <Itemstatus history={this.props.history} />
              ) : currentMenu == "/sales/discount reason" ? (
                <Discountreason history={this.props.history} />
              ) : currentMenu == "/sales/foc reason" ? (
                <FOCreason history={this.props.history} />
              ) : currentMenu == "/sales/payment group" ? (
                <PaymentGroup history={this.props.history} />
              ) : currentMenu == "/sales/payment type" ? (
                <PaymentType history={this.props.history} />
              ) : currentMenu == "/config interface/occupation" ? (
                <OccupationType history={this.props.history} />
              ) : currentMenu == "/config interface/source" ? (
                <Configsource history={this.props.history} />
              ) : currentMenu == "/config interface/transaction" ? (
                <Transactionreason history={this.props.history} />
              ) : currentMenu == "/config interface/void transaction" ? (
                <Transactionvoid history={this.props.history} />
              ) : currentMenu == "/treatment/reason" ? (
                <Adjustmentreason history={this.props.history} />
              ) : currentMenu == "/sales" ? (
                <Itemstatusgroup history={this.props.history} />
              ) : currentMenu == "/config interface" ? (
                <OccupationType history={this.props.history} />
              ) : currentMenu == "/Appointmentconfig" ? (
                <Equipment history={this.props.history} />
              ) : currentMenu == "/Item-Classification/range/product" ? (
                <Itemclassproduct history={this.props.history} />
              ) : currentMenu == "/Item-Classification" ? (
                <Division history={this.props.history} />
              ) : currentMenu == "/Business hours" ? (
                <Businesshours history={this.props.history} />
              ) : currentMenu == "/Tax type" ? (
                <Taxtype history={this.props.history} />
              ) : currentMenu == "/Outlet master" ? (
                <Outletmaster history={this.props.history} />
              ) : currentMenu == "/Customer master" ? (
                <Customermasterone history={this.props.history} />
              ) : currentMenu == "/Customer masterII" ? (
                <Customermastertwo history={this.props.history} />
              ) : currentMenu == "/normal reward policy" ? (
                <Normalrewardpolicy history={this.props.history} />
              ) : currentMenu == "/redeem policy" ? (
                <Redeempolicy history={this.props.history} />
              ) : currentMenu == "/bonus reward" ? (
                <BonusReward history={this.props.history} />
              ) : currentMenu == "/vendor master" ? (
                <Vendormaster history={this.props.history} />
              ) : currentMenu == "/country setting" ? (
                <Countrysetting history={this.props.history} />
              ) : currentMenu == "/employee master" ? (
                <Employeemaster history={this.props.history} />
              ) : currentMenu == "/security master" ? (
                <Securitymaster history={this.props.history} />
              ) : (
                <div>Loading..</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getTokenDetails,
    },
    dispatch
  );
};

export const Backend = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(BackendClass)
);
