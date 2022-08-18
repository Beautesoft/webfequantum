import React, { Component } from "react";
import { NormalInput, NormalButton, NormalSelect } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCommonApi, commonCreateApi } from "redux/actions/common";

import "./style.scss";
import { withTranslation } from "react-i18next";

export class itemStatusPopupClass extends Component {
  state = {
    data_list: [],
    item_status_options: [],
    focReasonList: [],
    sourceList: [],
  };

  componentDidMount() {
    let { item_status_options, focReasonList } = this.state;

    this.props.getCommonApi(`focreason/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          focReasonList.push({
            value: Number(value.id),
            label: value.foc_reason_ldesc,
          });
        }
        this.setState({ focReasonList });
      }
    });
    this.props.getCommonApi(`itemstatus/`).then(key => {
      let { status, data } = key;
      if (status === 200) {
        for (let value of data) {
          item_status_options.push({
            value: Number(value.id),
            label: value.status_short_desc,
          });
        }
        this.setState({ item_status_options });
      }
    });
    this.getStatusList();
  }
  getStatusList = () => {
    let { data_list } = this.state;
    let { basicApptDetail } = this.props;
    this.props
      .getCommonApi(
        `cartpopup/?cust_noid=${basicApptDetail.custId}&cart_id=${this.props.id}&is_status=1`
      )
      .then(async key => {
        let { status, data } = key;
        if (status == "200") {
          console.log(key, "cartstatuspopuplist");
          data_list = data;
          await this.setState({
            data_list,
          });
          if (this.state.data_list.length > 0) {
            document
              .getElementById(this.state.data_list[0].id)
              .classList.toggle("d-none");
          }
        }
      });
  };

  handleSubmit = () => {
    let { data_list, sourceList } = this.state;

    for (let value of data_list) {
      sourceList.push({
        id: value.id,
        itemstatus: value.itemstatus,
        focreason: value.focreason,
      });
    }

    this.props.commonCreateApi(`cartpopup/`, sourceList).then(key => {
      let { status, data } = key;
      if (status == 200) {
        this.props.handleModal();
      }
    });
  };

  handleChange = (e, index) => {
    let { data_list } = this.state;
    let data = e.target.value;
    if ([e.target.name] == "itemstatus" || [e.target.name] == "focreason") {
      data_list[index][e.target.name] = Number(data);
    } else {
      data_list[index][e.target.name] = data;
    }
    this.setState({ data_list });
  };

  handleAccordion = id => {
    let elements = document.getElementsByClassName("accordion");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("d-none");
    }
    document.getElementById(id).classList.toggle("d-none");
    console.log(elements);
  };

  render() {
    let { data_list, item_status_options, focReasonList } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid mb-4 mt-2 product-details">
          <div className="row">
            <div className="col-10">
              <h4>{t("Item Status")}</h4>
            </div>
            {data_list && data_list.length > 0 ? (
              <div className="col-2">
                <NormalButton
                  mainbg={false}
                  className="col-12 fs-15 submit-btn"
                  label="Done"
                  onClick={() => this.handleSubmit()}
                />
              </div>
            ) : null}
          </div>
          <div className="row w-100 pl-3 pr-5 mt-2 fw-500 h6">
            <div className="col-3">{`Item`}</div>
            <div className="col-1 text-center">{t(`Qty`)}</div>
            <div className="col text-right">{t(`Unit Price`)}</div>
            <div className="col text-right">{t(`Disc.`)} $</div>
            <div className="col text-right">{t(`D/Price`)}</div>
            <div className="col text-right">{t(`Amount`)}</div>
            <div className="col text-right">{t(`Deposit`)}</div>
            <div className="col-2">{`Staff`}</div>
          </div>
          {data_list && data_list.length <= 0 ? (
            <div className="row pl-5 pr-5 mt-2">{t("No Record Found")}</div>
          ) : null}
          <div className="row w-00 pl-5 pr-5 mt-2 overflow-auto">
            {data_list &&
              data_list.length > 0 &&
              data_list.map((item, index) => {
                return (
                  <div className="row w-100 mb-2" key={index}>
                    <div
                      className="row w-100 border rounded p-3 accordion-menu"
                      onClick={() => this.handleAccordion(item.id)}
                    >
                      <div className="col-3">{item.itemdesc}</div>
                      <div className="col-1 text-center">
                        {/* <NormalInput
                          name="quantity"
                          type="number"
                          value={item.quantity}
                          onChange={e => this.handleChange(e, index)}
                        /> */}
                        {item.quantity}
                      </div>
                      <div className="col text-right">{item.price}</div>
                      <div className="col text-right">{item.discount_amt}</div>
                      <div className="col text-right">
                        {item.discount_price}
                      </div>
                      <div className="col text-right">{item.trans_amt}</div>
                      <div className="col text-right">{item.deposit}</div>
                      <div className="col-2">{item.sales_staffs}</div>
                    </div>
                    <div
                      className="row w-100 rounded bg-light p-3 d-none accordion"
                      id={item.id}
                    >
                      <div className="row w-100 pl-3 mb-3">
                        <div className="col-4">
                          <label className="text-left text-black common-label-text fs-17 pb-2">
                            {t("Item Status")}
                          </label>
                          <div className="input-group">
                            <NormalSelect
                              options={item_status_options}
                              value={item.itemstatus ? item.itemstatus : 0}
                              name="itemstatus"
                              onChange={e => this.handleChange(e, index)}
                            />
                          </div>
                        </div>
                        {item.is_foc ? (
                          <>
                            <div className="col-4">
                              <label className="text-left text-black common-label-text fs-17 pb-2">
                                {t("FOC Reason")}
                              </label>
                              <div className="input-group">
                                <NormalSelect
                                  options={focReasonList}
                                  value={item.focreason ? item.focreason : 0}
                                  name="focreason"
                                  onChange={e => this.handleChange(e, index)}
                                />
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="input-group mt-4 pt-3">
                                <div className="p-2">
                                  <input
                                    type="checkbox"
                                    checked={item.is_foc}
                                    name="is_foc"
                                    onChange={e => this.handleChange(e, index)}
                                  />
                                </div>
                                <label className="text-left text-black common-label-text fs-17 mt-1">
                                  {t("FOC")}
                                </label>
                              </div>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  basicApptDetail: state.appointment.basicApptDetail,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonCreateApi,
    },
    dispatch
  );
};

export const ItemStatusPopup = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(itemStatusPopupClass)
);
