import React, { Component } from "react";
import { NormalButton, NormalSelect, NormalModal } from "component/common";
import { TableWrapper } from "component/common";
import { NormalInput, NormalDate } from "component/common";
import { dateFormat } from "service/helperFunctions";
import { history } from "helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonPatchApi,
  commonUpdateApi,
} from "redux/actions/common";
import { withTranslation } from "react-i18next";

export class ConfirmBookingClass extends Component {
  state = {
    headerDetails: [
      { label: "Customer Name" },
      {
        label: "Appointment Date",
        divClass: "justify-content-end text-right",
      },
      { label: "Appointment Time", divClass: "justify-content-end text-right" },
      { label: "Status" },
      { label: "Customer Phone" },
      { label: "Staff Name" },
      {
        label: "Created Date & Time",
        divClass: "justify-content-end text-right",
      },
      { label: "Book", divClass: "justify-content-center text-center" },
      { label: "Delete", divClass: "justify-content-center text-center" },
    ],
    confirmBookingList: [],
    pageMeta: {},
    isConfirmOpen: false,
    SelectedId: "",
    formField: {
      bookingDate: new Date(),
    },
    page: 1,
    limit: 10,
    SelectedItem: "",
  };

  componentDidMount() {
    this.confirmBookingList();
  }

  confirmBookingList = () => {
    let { confirmBookingList, pageMeta, formField, page, limit } = this.state;
    let { bookingDate } = formField;

    this.props
      .getCommonApi(
        `confirmbooking/?date=${dateFormat(
          bookingDate,
          "yyyy-mm-dd"
        )}&page=${page}&limit=${limit}`
      )
      .then(async res => {
        console.log(res, "transactionlistdsfdfaafg");
        await this.setState({ confirmBookingList: [] });
        confirmBookingList = res.data.dataList;
        pageMeta = res.data.meta.pagination;
        this.setState({ confirmBookingList, pageMeta });
      });
  };

  handlePagination = async pageNo => {
    let { page } = this.state;
    page = pageNo.page;
    await this.setState({
      page,
    });
    this.confirmBookingList();
  };

  handleSelectedRow = async (data, clickItem) => {
    await this.setState({
      SelectedItem: clickItem,
      selectedId: data.id,
    });
    this.handlecloseDialog();
  };
  handlecloseDialog = () => {
    this.setState(prevState => ({
      isConfirmOpen: !prevState.isConfirmOpen,
    }));
  };

  handleDatePick = async ({ target: { value, name } }) => {
    let { formField } = this.state;
    formField[name] = value;
    await this.setState({
      formField,
    });
  };

  handleSearch = async () => {
    await this.setState({
      page: 1,
    });
    this.confirmBookingList();
  };
  handleSendBackConfirm = () => {
    try {
      let { SelectedItem } = this.state;
      let is_del = false;
      let is_book = false;
      if (SelectedItem === "book") {
        is_book = true;
      } else {
        is_del = true;
      }

      let body = { is_del: is_del, is_book: is_book };

      this.props
        .commonUpdateApi(`confirmbooking/${this.state.selectedId}/`, body)
        .then(res => {
          this.handlecloseDialog();
          this.handleSearch();
        });
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    let {
      headerDetails,
      pageMeta,
      confirmBookingList,
      isConfirmOpen,
      formField,
    } = this.state;
    let { bookingDate } = formField;
    let { t } = this.props;
    return (
      <div className="confirm-booking container-fluid">
        <div className="row pb-md-2">
          <div className="col-md-3 mb-4">
            <p
              className="fw-500 h5 cursor-pointer"
              onClick={() => history.push("/admin/newappointment/")}
            >
              {t("Booking")}&nbsp;&gt;&nbsp;{t(`Confirm Booking`)}
            </p>
          </div>
        </div>
        <div className="col-md-12">
          <div className="d-flex justify-content-end">
            <div className="col-md-2 mb-3">
              <div className="">
                <NormalDate
                  value={bookingDate}
                  name="bookingDate"
                  type="date"
                  onChange={this.handleDatePick}
                  showDisabledMonthNavigation
                  showYearDropdown={true}
                />
              </div>
            </div>
            <div className="col-md-2 col-12">
              <NormalButton
                mainbg={true}
                className="confirm"
                label="Search"
                outline={false}
                onClick={this.handleSearch}
              />
            </div>
          </div>
        </div>
        <div className="py-2">
          <div className="table-container">
            <TableWrapper
              headerDetails={headerDetails}
              queryHandler={this.handlePagination}
              pageMeta={pageMeta}
            >
              {confirmBookingList && confirmBookingList.length > 0 ? (
                confirmBookingList.map((dataitem, index) => {
                  let {
                    appt_date,
                    appt_fr_time,
                    appt_phone,
                    appt_status,
                    cust_name,
                    date_time,
                    emp_name,
                    id,
                    is_book,
                    is_del,
                    itemsite_code,
                  } = dataitem;
                  return (
                    <tr key={index}>
                      <td>
                        <div className="text-left">{cust_name}</div>
                      </td>
                      <td>
                        <div className="text-right">{appt_date}</div>
                      </td>
                      <td>
                        <div className="text-right">{appt_fr_time}</div>
                      </td>
                      <td>
                        <div className="text-left">{appt_status}</div>
                      </td>
                      <td>
                        <div className="text-left">{appt_phone}</div>
                      </td>
                      <td>
                        <div className="text-left">{emp_name}</div>
                      </td>
                      <td>
                        <div className="text-right">{date_time}</div>
                      </td>
                      <td className="position-relative">
                        <div className="d-flex justify-content-center">
                          <NormalButton
                            buttonClass={"mx-0 ml-1"}
                            mainbgrev={true}
                            className="confirm fs-11"
                            label={t("Book")}
                            outline={false}
                            onClick={() =>
                              this.handleSelectedRow(dataitem, "book")
                            }
                          />
                        </div>
                      </td>
                      <td className="position-relative">
                        <div className="d-flex justify-content-center">
                          <NormalButton
                            buttonClass={"mx-0 ml-1"}
                            resetbg={true}
                            className="confirm fs-11"
                            label={t("Delete")}
                            outline={false}
                            onClick={() =>
                              this.handleSelectedRow(dataitem, "delete")
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="12">
                    <div className="text-center">No data</div>
                  </td>
                </tr>
              )}
            </TableWrapper>

            <NormalModal
              className={"multiple-appointment"}
              modal={isConfirmOpen}
              //style={{ minWidth: "30%" }}
              handleModal={() => {}}
            >
              <div className="row m-2">
                <div className="col-12 h4 p-0">{t("Confirm")}</div>

                <div className="col-12 h6">
                  {t("Are you sure want to update")}?
                </div>

                <div className="d-flex justify-content-start mt-4 w-100">
                  <NormalButton
                    buttonClass={"mx-2"}
                    resetbg={true}
                    className="col-12 multiple-customer"
                    label={"Cancel"}
                    onClick={this.handlecloseDialog}
                  />
                  <NormalButton
                    buttonClass={"mx-2"}
                    mainbgrev={true}
                    className="col-12 fs-15 multiple-customer"
                    label={"Confirm"}
                    onClick={this.handleSendBackConfirm}
                  />
                </div>
              </div>
            </NormalModal>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tokenDetails: state.authStore.tokenDetails,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getCommonApi,
      commonUpdateApi,
      commonPatchApi,
    },
    dispatch
  );
};

export const ConfirmBooking = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ConfirmBookingClass)
);
