import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "assets/scss/components/sidebar.scss";
import { getTokenDetails } from "redux/actions/auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import dashboard from "assets/images/Nav-image/dashboard.png";
import customer from "assets/images/Nav-image/customer.png";
import appointment from "assets/images/Nav-image/appointment.png";
import catalog from "assets/images/Nav-image/catalog.png";
import cart from "assets/images/Nav-image/cart.png";
import appointments from "assets/images/Nav-image/appointment.png";
import transaction from "assets/images/Nav-image/transaction.png";
import payroll from "assets/images/Nav-image/payroll.png";
import billing from "assets/images/Nav-image/billing.png";
import staff from "assets/images/Nav-image/staff.png";
import inventory from "assets/images/Nav-image/inventory.png";
import settings from "assets/images/Nav-image/setting.png";
import dayend from "assets/images/Nav-image/dayend.png";
import tcm from "assets/images/Nav-image/tcm.png";
import { withTranslation } from "react-i18next";
import project from "assets/images/Nav-image/project.svg";
import quotation from "assets/images/Nav-image/quotation.svg";
import PO from "assets/images/Nav-image/PO.svg";

export class SidebarClass extends Component {
  //ADMINISTRATOR - 1 ,Operation  manager - 2, Therapist - 3, AppointmentAlone - 4
  state = {
    navLinks: [
      {
        to: "/admin/dashboard",
        label: "Dashboard",
        role: ["1", "2"],
        imgno: dashboard,

        rightskey: "flgdashboard",
      },
      {
        to: "/admin/kpidashboard",
        label: "KPI Dashboard",
        role: ["1", "2"],
        imgno: dashboard,

        rightskey: "flgkpidashboard",
      },
      // {
      //   to: "/admin/salons",
      //   label: "Saloon",
      //   role: ["ADMINISTRATOR"],
      // },
      {
        to: "/admin/customerplus",
        label: "Customer",
        role: ["1", "2", "3"],
        imgno: customer,

        rightskey: "flgcustomer",
      },
      {
        to: "/admin/newappointment",
        label: "Booking",
        role: ["1", "2", "3", "4"],
        imgno: appointment,
        rightskey: "flgappt",
      },
      {
        to: "/admin/catalog",
        label: "Catalog",
        role: ["1", "2", "3"],
        imgno: catalog,
        rightskey: "flgcatalog",
      },
      {
        to: "/admin/cart",
        label: "Cart",
        role: ["1", "2", "3"],
        imgno: cart,

        rightskey: "flgsales",
      },
      {
        to: "/admin/TCM",
        label: "TCM",
        role: ["1", "2", "3"],
        imgno: tcm,
        rightskey: "flgtcm",
      },
      {
        to: "/admin/appointment",
        label: "Appointments",
        role: [],
        imgno: appointment,
        rightskey: "flgAppoint",
      },
      {
        to: "/admin/payroll",
        label: "Payroll",
        role: ["1", "2"],
        imgno: payroll,
        rightskey: "flgpayroll",
      },
      {
        to: "/admin/transactionhistory",
        label: "Invoices",
        role: ["1", "2", "3"],
        imgno: transaction,

        rightskey: "flginvoices",
      },
      // {
      //   to: '/admin/payment',
      //   label: 'Payment',
      //   role: ['MANAGER','THERAPIST']
      // },
      {
        to: "/admin/billing",
        label: "Billing",
        role: [],
        imgno: billing,

        rightskey: "flgbi",
      },
      {
        to: "/admin/staffplus",
        label: "Staff",
        role: ["1", "2"],
        imgno: staff,

        rightskey: "flgstaff",
      },

      {
        to: "/admin/Inventory",
        label: "Inventory",
        role: ["1", "2", "3"],
        imgno: inventory,

        rightskey: "flginventory",
      },
      {
        to: "/admin/Settings",
        label: "Settings",
        role: [],
        imgno: settings,

        rightskey: "flgsettings",
      },
      {
        to: "/admin/dayendreport",
        label: "DayEnd",
        role: ["1", "2", "3"],
        imgno: dayend,

        rightskey: "flgdayend",
      },
      {
        to: "/admin/backend",
        label: "Backend",
        role: ["1", "2", "3"],
        imgno: dayend,

        rightskey: "flgbackend",
      },
      {
        to: "/admin/commission",
        label: "Commission",
        role: ["1", "2", "3"],
        imgno: quotation,
        rightskey: "flgcommission",
      },
      // {
      //   to: "/admin/service",
      //   label: "Services",
      //   role: ["ADMINISTRATOR"],
      // },
      // {
      //   to: "/admin/Product",
      //   label: "Product",
      //   role: ["ADMINISTRATOR"],
      // },
      // {
      //   to: "/admin/reviews",
      //   label: "Reviews",
      //   role: ["ADMINISTRATOR"],
      // },
      {
        to: "/admin/project",
        label: "Project",
        role: ["1", "2", "3"],
        imgno: project,

        rightskey: "flgproject",
      },
      {
        to: "/admin/quantum",
        label: "Quantum",
        role: ["1", "2", "3"],
        imgno: quotation,

        rightskey: "flgquantum",
      },
      // {
      //   to: "/admin/quotation",
      //   label: "Quotation",
      //   role: ["1", "2", "3"],
      //   imgno: quotation,
      //
      //   rightskey: "flgquotation",
      // },
      // {
      //   to: "/admin/po",
      //   label: "PO",
      //   role: ["1", "2", "3"],
      //   imgno: PO,
      //
      //   rightskey: "flgpo",
      // },
    ],
  };

  componentDidMount() {
    this.getToken();
    // console.log(['Manager','ADMINISTRATOR','Staffs'].includes('staffs'), "sidebare ===")
  }

  getToken = async () => {
    await this.props.getTokenDetails().then(res => {
      console.log(res, "sidebare");
    });
    // console.log(this.props, "sidebare");
  };

  handleMenu = () => {
    this.getToken();
  };

  render() {
    let { navLinks, ImagesLinks } = this.state;
    let { menuOpen, handleSidenav, tokenDetail, t } = this.props;
    // console.log(this.props, "sidebare");
    return (
      <>
        <div className={`left-menu bg-site-primary  ${menuOpen ? "open" : ""}`}>
          <PerfectScrollbar>
            <ul>
              {navLinks.map(({ to, label, role, imgno, rightskey }, index) =>
                //role.includes("THERAPIST") ? (
                tokenDetail[rightskey] ? (
                  <li key={index}>
                    <NavLink
                      to={to}
                      onClick={this.handleMenu}
                      className="nav-link"
                    >
                      <div className="sidebar-menu">
                        <img
                          src={imgno}
                          height="50"
                          alt="s"
                          className="images"
                        />
                        <span className="sidebar-menu-desc pl-3">
                          {t(label)}
                        </span>
                      </div>
                    </NavLink>
                  </li>
                ) : (
                  ""
                )
              )}
            </ul>
          </PerfectScrollbar>
        </div>

        <div
          className={`sidemenu-overlay ${menuOpen ? "open" : ""}`}
          onClick={() => handleSidenav()}
        ></div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetail: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getTokenDetails,
    },
    dispatch
  );
};

export const Sidebar = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SidebarClass)
);
