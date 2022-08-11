import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../assets/scss/components/navbar.scss";
import { logout } from "../../service/utilities";
import { NavLink } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ProfileMenu } from "./ProfileMenu";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getTokenDetails } from "../../redux/actions/auth";
import UserImage from "../../assets/images/user-image.png";
import TcmImage from "../../assets/images/Nav-image/tcm.png";
import headerLogo from "../../assets/images/headerLogo.png";
import companyLogo from "../../assets/images/beautesoftlogo.png";
import beautesoftlogo from "../../assets/images/beautesoftlogo.png";
import SequoiaLogo from "assets/images/sequoialogo.png";
import i18n from "i18next";
import { NormalButton, NormalInput, NormalModal } from "component/common";
import closeIcon from "assets/images/close.png";
import "./ProfileMenu/style.scss";
import { getCommonApi } from "redux/actions/common";

export class NavbarClass extends Component {
  state = {
    langOptions: [
      { label: "EN-US", value: "en" },
      { label: "ZH-SG", value: "zh_sg" },
    ],
    selectedLang: "",
    isMounthed: true,
    isAboutPopModal: false,
    menu: false,
    AboutInfo: {},
  };

  componentDidMount() {
    this.updateState({ selectedLang: localStorage.getItem("lang") ?? "en" });
    this.getAboutInfo();
    // this.props.getTokenDetails().then(res => {
    //   console.log(res, "selected token details");
    // });
  }

  getAboutInfo = () => {
    this.props.getCommonApi(`about/`).then(key => {
      let { status, data } = key;

      if (status == 200) {
        if (data) {
          let AboutInfo = data[0];
          console.log(AboutInfo, "Aboutresponse");
          this.setState({ AboutInfo });
        }
      }
    });
  };
  updateState = data => {
    if (this.state.isMounthed) this.setState(data);
  };

  componentWillUnmount() {
    this.state.isMounthed = false;
  }
  aboutpopup() {
    this.setState({
      isAboutPopModal: !this.state.isAboutPopModal,
    });
  }
  handleTCM = () => {
    this.props.getCommonApi(`currentuser/`).then(key => {
      let { status, data } = key;
      console.log(key, "TCMresponse");
      if (status == 200) {
        if (data) {
          let FinalUrl =
            data.url +
            "?username=" +
            data.username +
            "&password=" +
            data.password;
          window.open(FinalUrl);
        }
      }
    });
  };
  toggleMenu = () => {
    this.setState({
      menu: !this.state.menu,
    });
  };
  render() {
    const { active } = this.props;
    // let { navLinks } = this.state;
    let { langOptions, selectedLang, isAboutPopModal, menu, AboutInfo } =
      this.state;
    let { menuOpen, handleSidenav, changeProfileState } = this.props;
    let { tokenDetails } = this.props;
    const show = this.state.menu ? "show" : "";
    return (
      <header className="header">
        <div className="site-header">
          <nav className="navbar navbar-expand-lg navbar-expand-md  navbar-light bg-light">
            {window.location.pathname === "/admin/mobileappointment" ? (
              <a className="navbar-brand" href="#">
                <Link
                  to={"/admin/mobileappointment"}
                  className="navbar-logo d-flex align-items-center h-100"
                >
                  <img
                    src={headerLogo}
                    width="184"
                    height="40"
                    alt=""
                    className="bg-white"
                  />
                </Link>
              </a>
            ) : (
              <a className="navbar-brand" href="#">
                <Link
                  to={
                    this.props.tokenDetails.role_code == "3"
                      ? "/admin/customerplus"
                      : this.props.tokenDetails.role_code == "4"
                      ? "/admin/newappointment"
                      : "/admin/dashboard"
                  }
                  className="navbar-logo d-flex align-items-center h-100"
                >
                  <img
                    src={headerLogo}
                    width="184"
                    height="40"
                    alt=""
                    className="bg-white"
                  />
                </Link>
              </a>
            )}
            <button
              className="navbar-toggler"
              type="button"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={this.toggleMenu}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              style={menu ? { display: "block" } : { display: "none" }}
              className={`collapse navbar-collapse navbar-menu`}
              id="navbar-menu"
            >
              <ul className="navbar-nav position-relative ml-auto p-lg-0">
                <li className="nav-item nav-link d-flex align-items-center justify-content-center py-1">
                  {tokenDetails.branch}
                </li>
                <li className="nav-item d-flex align-items-center position-relative">
                  <div className="bell-icon">
                    <i className="icon-bell-o"></i>
                  </div>
                  <div className="bell-notify"></div>
                </li>
                <li className="nav-item nav-link cursor-pointer d-flex align-items-center justify-content-center py-1">
                  <select
                    style={{ background: "white", paddingTop: "3px" }}
                    onChange={e => {
                      i18n.changeLanguage(e.target.value);
                      localStorage.setItem("lang", e.target.value);
                      this.updateState({ selectedLang: e.target.value });
                    }}
                  >
                    {langOptions.map((e, index) => (
                      <option
                        value={e.value}
                        selected={selectedLang == e.value}
                        key={index}
                      >
                        {e.label}
                      </option>
                    ))}
                  </select>
                </li>
                <li className="nav-item nav-link d-flex align-items-center justify-content-center py-1">
                  <NormalButton
                    buttonClass={"share w-100"}
                    mainbg={true}
                    className="col-12"
                    label="About"
                    onClick={() => this.aboutpopup()}
                  />
                </li>
                <li
                  className="nav-item nav-link cursor-pointer d-flex d-flex align-items-center profile-icon py-1"
                  onClick={e => changeProfileState(e, !active)}
                >
                  <img
                    className="border-radius-circle userProfile"
                    src={UserImage}
                    alt="User"
                  />
                  <span className="ml-2">{tokenDetails.username}</span>
                  <i className="icon-down-arrow"></i>
                </li>
                <ProfileMenu active={active} data={tokenDetails} />
              </ul>
            </div>
          </nav>
        </div>
        <NormalModal
          className={"retail-price-modal"}
          style={{ minWidth: "32%" }}
          modal={isAboutPopModal}
          handleModal={() => this.aboutpopup()}
        >
          <div className="d-flex p-1">
            <div className="col-11">
              <img src={beautesoftlogo} width="100" height="50" alt="" />
              <p className="fs-12">Version: {AboutInfo.version_no}</p>
            </div>
            <div className="col-1 p-1">
              <img
                onClick={() => this.aboutpopup()}
                className="close"
                src={closeIcon}
                alt=""
              />
            </div>
          </div>
          <div className="d-flex p-1 justify-content-center align-items-center">
            <div className="col-md-6 fs-12">This software is licensed to:</div>
            <div className="col-md-6 fs-12">
              <div className="d-flex justify-content-start px-1">
                <img src={headerLogo} width="100%" height="75%" alt="" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <div className="d-flex fs-13 border border-primary rounded-lg">
              <div className="col-12 p-1">
                <div className="d-flex justify-content-start py-1">
                  <div className="col-md-6 col-12">Company</div>
                  <div className="col-md-6 col-12">
                    {AboutInfo.company_name}
                  </div>
                </div>
                <div className="d-flex justify-content-start py-1">
                  <div className="col-md-6 col-12">UEN</div>
                  <div className="col-md-6 col-12">{``}</div>
                </div>
                <div className="d-flex justify-content-start py-1">
                  <div className="col-md-6 col-12">Registration</div>
                  <div className="col-md-6 col-12">{AboutInfo.uen_number}</div>
                </div>

                <div className="d-flex justify-content-start py-1">
                  <div className="col-md-6 col-12">Valid Until</div>
                  <div className="col-md-6 col-12">{AboutInfo.valid_date}</div>
                </div>

                <div className="d-flex justify-content-start py-1">
                  <div className="col-md-6 col-12">License Key</div>
                  <div className="col-md-6 col-12">{AboutInfo.license_key}</div>
                </div>

                <div className="d-flex justify-content-start py-1">
                  <div className="col-md-6 col-12">Site Code</div>
                  <div className="col-md-6 col-12">{AboutInfo.sitecode}</div>
                </div>

                <div className="d-flex justify-content-start py-1">
                  <div className="col-md-6 col-12">Version</div>
                  <div className="col-md-6 col-12">
                    {AboutInfo.version_type}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex fs-13 justify-content-start py-1 p-1">
            <div className="col-md-6 col-12">
              <p>
                Copyrights ©2021 Sequoia Pte Ltd Powered by&nbsp;
                <a href="#">acy7lab.com</a>
              </p>
            </div>
            <div className="col-md-4 col-12">
              <img src={SequoiaLogo} width="225" height="75" alt="" />
            </div>
          </div>

          {/* <div className="text-center">
            <NormalButton
              buttonclassName={"share w-100"}
              mainbg={true}
              className="col-3 fs-15 mt-3 text-center"
              label="Close"
              onClick={() => this.aboutpopup()}
            />
          </div> */}
        </NormalModal>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getTokenDetails,
      getCommonApi,
    },
    dispatch
  );
};

let component = NavbarClass;

export const Navbar = connect(mapStateToProps, mapDispatchToProps)(component);
