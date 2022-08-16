import React, { Component } from "react";
import {
  NormalInput,
  NormalSelect,
  NormalButton,
  NormalDate,
  TableWrapper,
  NormalMultiSelect,
} from "component/common";
import { withTranslation } from "react-i18next";
import { dateFormat } from "service/helperFunctions";
import { getCommonApi } from "redux/actions/common";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./style.scss";

export class ItemUsageListClass extends Component {
  state = {
    itemMemoList: [],
    meta: {},
    itemMemoListHeader: [
      { label: "Branch" },
      { label: "Treatment", divClass: "justify-content-end text-right" },
      { label: "Usage products" },
      { label: "Qty", divClass: "justify-content-end text-right" },
      { label: "UOM" },
      { label: "Stock" },
      { label: "Item Code" },
      { label: "Link Code" },
    ],
    startDate: new Date(),
    endDate: new Date(),
    Treatment: [],
    inventoryItem: [],
    InventoryList: [],
    TreatmentList: [],
    isMounted: true,
    page: 1,
    limit: 10,
  };
  componentWillUnmount() {
    this.state.isMounted = false;
  }

  componentDidMount() {
    this.getItemMemoList({});
    this.geTreatmentMultiList();
    this.getMultiInventoryList();
  }
  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };
  geTreatmentMultiList = async () => {
    let { TreatmentList } = this.state;
    await this.props.getCommonApi("servicelist/").then(async res => {
      for (let key of res.data) {
        TreatmentList.push({ value: key.id, label: key.item_name });
      }
      await this.updateState({ TreatmentList });
    });
  };

  getMultiInventoryList = async () => {
    let { InventoryList } = this.state;
    await this.props.getCommonApi("productlist/").then(async res => {
      for (let key of res.data) {
        InventoryList.push({ value: key.id, label: key.item_name });
      }
      await this.updateState({ InventoryList });
    });
  };

  getItemMemoList = data => {
    let { page, limit, startDate, endDate, inventoryItem, Treatment, meta } =
      this.state;

    let inventory = [];
    let treatment = [];
    inventory = inventoryItem
      .map(e => e.value)
      .reduce((a, e) => (a === "" ? e : a + "," + e), "");
    treatment = Treatment.map(e => e.value).reduce(
      (a, e) => (a === "" ? e : a + "," + e),
      ""
    );
    this.props
      .getCommonApi(
        `treatmentusagelist/?from_date=${dateFormat(
          startDate
        )}&to_date=${dateFormat(
          endDate
        )}&item_desc=${inventory}&treatment_desc=${treatment}&page=${page}&limit=${limit}`
      )
      .then(key => {
        let { status, data } = key;
        console.log(key, "itemmemolist");
        if (status === 200) {
          if (data) {
            this.setState({
              itemMemoList: data.dataList,
              meta: data.meta.pagination,
            });
          }
        }
      });
  };

  handlePagination = async page => {
    console.log(page, "dsfsdfsdfsdf");
    await this.setState({ page: page.page });
    this.getItemMemoList(page);
  };

  handleChange = async ({ target: { value, name } }) => {
    await this.setState({
      [name]: value,
    });
  };

  handleTreatmentMultiSelect = (data = []) => {
    console.log(data);
    this.updateState({ Treatment: data });
  };

  handleProductMultiSelect = (data = []) => {
    console.log(data);
    this.updateState({ inventoryItem: data });
  };

  render() {
    let {
      itemMemoList,
      itemMemoListHeader,
      startDate,
      InventoryList,
      TreatmentList,
      Treatment,
      inventoryItem,
      endDate,
      meta,
    } = this.state;
    let { t } = this.props;
    return (
      <div className="itemUsageList-section col-md-11">
        <div className="col-md-12">
          <p className="label-head mb-4">{t("Treatment Usage")}</p>
        </div>
        <div className="d-flex flex-wrap py-4">
          <div className="col-md-2 col-12 mb-1">
            <label>{t("From Date")}</label>
            <NormalDate
              value={new Date(startDate)}
              name="startDate"
              type="date"
              onChange={this.handleChange}
              maxDate={new Date()}
              showDisabledMonthNavigation
            />
          </div>
          <div className="col-md-2 col-12 mb-1">
            <label>{t("To Date")}</label>
            <NormalDate
              value={new Date(endDate)}
              name="endDate"
              type="date"
              onChange={this.handleChange}
              minDate={new Date(startDate)}
              maxDate={new Date()}
              showDisabledMonthNavigation
            />
          </div>
          <div className="col-md-3 col-12 mb-1">
            <label>{t("Treatment")}</label>

            <NormalMultiSelect
              placeholder="search service"
              handleMultiSelect={this.handleTreatmentMultiSelect}
              options={TreatmentList}
            />
          </div>
          <div className="col-md-3 col-12 mb-1">
            <label>{t("Inventory Item")}</label>

            <NormalMultiSelect
              handleMultiSelect={this.handleProductMultiSelect}
              options={InventoryList}
              placeholder="search product"
            />
          </div>
          <div className="col-md-2 col-12 mb-1">
            <NormalButton
              buttonClass={`d-flex py-2`}
              mainbgrev={true}
              className="col-12 mt-3"
              label="search"
              onClick={() => this.getItemMemoList({})}
            />
          </div>
        </div>
        <div className="table-container table-responsive mt-3">
          <TableWrapper
            headerDetails={itemMemoListHeader}
            queryHandler={this.handlePagination}
            pageMeta={meta}
          >
            {itemMemoList && itemMemoList.length > 0 ? (
              itemMemoList.map((item, index) => {
                return (
                  <tr className="w-100" key={index}>
                    <td>
                      <div
                        className={`text-left ${
                          !item.is_allow ? "text-danger" : ""
                        }`}
                      >
                        {item.site_code}
                      </div>
                    </td>
                    <td>
                      <div className="text-right">{item.treatment_code}</div>
                    </td>
                    <td>
                      <div className="text-left">{item.item_desc}</div>
                    </td>
                    <td>
                      <div className="text-right">{item.qty}</div>
                    </td>
                    <td>
                      <div className="text-left">{item.uom}</div>
                    </td>
                    <td>
                      <div className="text-left">{item.service_stock}</div>
                    </td>
                    <td>
                      <div className="text-left">{item.item_code}</div>
                    </td>
                    <td>
                      <div className="text-left">{item.link_code}</div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="12">
                  <div className="d-flex align-items-center justify-content-center">
                    {`No data`}
                  </div>
                </td>
              </tr>
            )}
          </TableWrapper>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
    },
    dispatch
  );
};

export const ItemUsageList = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ItemUsageListClass)
);
