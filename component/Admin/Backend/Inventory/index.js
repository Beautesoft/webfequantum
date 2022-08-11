import React, { Component } from "react";
import { NormalButton } from "component/common";
//import "./style.scss";
import { Navigation } from "react-minimal-side-navigation";
import { CgMenuLeft } from "react-icons/cg";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
export class InventoryClass extends Component {
  state = {
    currentMenu: "/",
    ismenu: false,
  };

  handleMenuChange = (itemId) => {
    this.setState({
      currentMenu: itemId,
    });
  };

  handlemenuoption = () => {
    this.setState({
      ismenu: !this.state.ismenu,
    });
  };
  render() {
    let { currentMenu, ismenu } = this.state;
    let { t } = this.props;
    return (
      <div className="container-fluid itemmaster-container">
        <div className="row mb-4">
          <div className="col-md-4 col-lg-2 mb-2">
            <Link to="/admin/backend/">
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
                      title: t("Stock Usage Memo"),
                      itemId: "/",
                    },
                    {
                      title: t("Stock Movement"),
                      itemId: "/stockmovement",
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
                <div>Stock Usage Memo</div>
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

export const Inventory = withTranslation()(InventoryClass);
