import React, { Component } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import { InventoryList } from "./InventoryList";
import { withTranslation } from "react-i18next";
import { ItemUsageList } from "../ItemUsageList";
import { Navigation } from "react-minimal-side-navigation";
import { CgMenuLeft } from "react-icons/cg";
import {
  updateForm,
  getSelectedTreatmentList,
} from "redux/actions/appointment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  ListStocksPOHQ,
  ListStocksTransferIn,
  ListStocksTransferOut,
  ListStockTake,
  ListStocksRTN,
  ListStocksPOApproved,
  ListStocksPO,
  ListStocksGRN,
  ListStocksDO,
  ListStocksAdjustment,
  ListStockReport,
  ListStockMemo,
  StockSettings,
} from "pages/Inventory";

export class InventoryMainPageClass extends Component {
  state = {
    //currentMenu: "/",
    ismenu: true,
  };

  handleMenuChange = async itemId => {
    // this.setState({
    //   currentMenu: itemId,
    // });
    await this.props.updateForm("SelectedInventoryMenu", itemId);
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
                    title: t("Stock Usage Memo"),
                    itemId: "/",
                  },
                  {
                    title: t("Treatment Usage"),
                    itemId: "/ItemUsageMemo",
                  },
                  {
                    title: t("Stock Memo"),
                    itemId: "/StockMemo",
                  },
                  {
                    title: t("Stock Report"),
                    itemId: "/StockReport",
                  },
                  {
                    title: t("Stocks Adjustment"),
                    itemId: "/StocksAdjustment",
                  },
                  {
                    title: t("Stocks DO"),
                    itemId: "/StocksDO",
                  },
                  {
                    title: t("Stock Settings"),
                    itemId: "/StockSettings",
                  },
                  {
                    title: t("Stocks GRN"),
                    itemId: "/StocksGRN",
                  },
                  {
                    title: t("Stocks PO"),
                    itemId: "/StocksPO",
                  },
                  {
                    title: t("Stocks PO Approved"),
                    itemId: "/StocksPOApproved",
                  },
                  {
                    title: t("Stocks PO HQ"),
                    itemId: "/StocksPOHQ",
                  },
                  {
                    title: t("Stocks RTN"),
                    itemId: "/StocksRTN",
                  },
                  {
                    title: t("Stocks Transfer In"),
                    itemId: "/StocksTransferIn",
                  },
                  {
                    title: t("Stocks Transfer Out"),
                    itemId: "/StocksTransferOut",
                  },
                  {
                    title: t("Stock Take"),
                    itemId: "/StockTake",
                  },
                ]}
              />
            ) : null}
          </div>
        </div>
        <div className={ismenu == true ? "col-md-10 mt-3" : "col-md-12 mt-3"}>
          <div className="row">
            {/* <CgMenuLeft
              size={30}
              onClick={() => this.handlemenuoption()}
              label={`Menus`}
            /> */}
            {currentMenu == "/" ? (
              <InventoryList />
            ) : currentMenu == "/ItemUsageMemo" ? (
              <ItemUsageList />
            ) : currentMenu == "/StockMemo" ? (
              <ListStockMemo />
            ) : currentMenu == "/StockReport" ? (
              <ListStockReport />
            ) : currentMenu == "/StocksAdjustment" ? (
              <ListStocksAdjustment />
            ) : currentMenu == "/StocksDO" ? (
              <ListStocksDO />
            ) : currentMenu == "/StockSettings" ? (
              <StockSettings />
            ) : currentMenu == "/StocksGRN" ? (
              <ListStocksGRN />
            ) : currentMenu == "/StocksPO" ? (
              <ListStocksPO />
            ) : currentMenu == "/StocksPOApproved" ? (
              <ListStocksPOApproved />
            ) : currentMenu == "/StocksPOHQ" ? (
              <ListStocksPOHQ />
            ) : currentMenu == "/StocksRTN" ? (
              <ListStocksRTN />
            ) : currentMenu == "/StocksTransferIn" ? (
              <ListStocksTransferIn />
            ) : currentMenu == "/StocksTransferOut" ? (
              <ListStocksTransferOut />
            ) : currentMenu == "/StockTake" ? (
              <ListStockTake />
            ) : (
              <div>Loading..</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentMenu: state.appointment.SelectedInventoryMenu,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      updateForm,
    },
    dispatch
  );
};

export const InventoryMainPage = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(InventoryMainPageClass)
);
