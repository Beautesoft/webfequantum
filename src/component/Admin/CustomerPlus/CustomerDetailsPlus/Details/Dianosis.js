import React from "react";
import { NormalButton, NormalModal, NormalSelect } from "component/common";
import { InputSearch, TableWrapper } from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import closeIcon from "assets/images/close.png";
import _ from "lodash";
import { AddPhotoPopup } from "./AddPhotoPopup";
import { Navigation } from "react-minimal-side-navigation";
import { ComparePhotoPopup } from "./ComparePhotoPopup";
import { withTranslation } from "react-i18next";
import {
  getDiagnosisPhotos,
  getDiagnosisHistory,
} from "redux/actions/customerPlus";

export class DianosisClass extends React.Component {
  state = {
    photoTableHeader: [
      {
        label: "Date Taken",
        sortKey: "date",
        divClass: "justify-content-end text-right",
      },
      { label: "Diagnosis Code", sortKey: "code", enabled: true },
      { label: "Remarks", sortKey: "remarks", enabled: true },
      {
        label: "Compare",
        sortKey: "compare",
        divClass: "justify-content-center",
      },
      { label: "View", sortKey: "view", divClass: "justify-content-center" },
    ],
    photoList: [],
    historyTableHeader: [
      {
        label: "Compare Date",
        sortKey: "date",
        divClass: "justify-content-end text-right",
      },
      { label: "Compare Remarks", sortKey: "remarks", enabled: true },
      { label: "Diagnosis Reference", sortKey: "referance", enabled: true },
      {
        label: "Date",
        sortKey: "dDate",
        divClass: "justify-content-end text-right",
      },
      { label: "View", sortKey: "view", divClass: "justify-content-center" },
    ],
    historyList: [],
    visitTableHeader: [
      {
        label: "Date",
        sortKey: "date",
        divClass: "justify-content-end text-right",
      },
      { label: "PDPA", sortKey: "pdpa", enabled: true },
      {
        label: "Questionairre / Consultation",
        sortKey: "consultation",
        enabled: true,
      },
      {
        label: "Diagnosis",
        sortKey: "diagnosis",
        divClass: "justify-content-end text-right",
      },
      { label: "Consent Form", sortKey: "consent" },
      { label: "Treatment Done", sortKey: "treatments" },
      { label: "Sales", sortKey: "sales", divClass: "justify-content-center" },
    ],
    visitList: [],
    compareList: [],
    photoListMeta: {},
    historyMeta: {},
    visitMeta: {},
    active: false,
    currentIndex: -1,
    currentMenu: "/",
    selectedRemark: null,
    selectedHistoryCode: null,
    currentData: null,
    isAddPhotoOpen: false,
    isCompareOpen: false,
    isMounted: true,
    isLoading: true,
  };

  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const submenu = queryParams.get("submenu");
    if (submenu)
      if (submenu == "history" || submenu == "visits")
        this.setState({ currentMenu: "/" + submenu });
    this.loadDiagnosisPhotos();
    this.loadDiagnosisHistory();
  }

  loadDiagnosisPhotos = async (data = {}) => {
    this.updateState({ isLoading: true });
    let { page = 1, search = "" } = data;
    await this.props.getDiagnosisPhotos(
      this.props.id,
      `?page=${page}&search=${search}`
    );
    let { photoList } = this.props;
    this.state.photoList = photoList.diagnosisList;
    this.state.photoListMeta = photoList.pagination;
    this.updateState({ isLoading: false });
  };

  loadDiagnosisHistory = async (data = {}) => {
    this.updateState({ isLoading: true });
    let { page = 1, search = "" } = data;
    await this.props.getDiagnosisHistory(
      this.props.id,
      `?page=${page}&search=${search}`
    );
    let { historyList } = this.props;
    this.state.historyList = historyList.diagnosisList;
    this.state.historyMeta = historyList.pagination;
    this.updateState({ isLoading: false });
  };

  componentWillUnmount() {
    this.state.isMounted = false;
  }

  updateState = data => {
    if (this.state.isMounted) this.setState(data);
  };

  handleOutsideClick = e => {
    if (this.node != null) {
      if (this.node.contains(e.target)) {
        return;
      }
    }
    this.handleClick();
  };

  handlePagination = (type, page) => {
    if (type === "photo") {
      this.loadDiagnosisPhotos(page);
    }
    if (type === "history") {
    }
    if (type === "visit") {
    }
  };

  handlePhotosearch = event => {
    this.loadDiagnosisPhotos({ search: event.target.value });
  };
  handleHistorySearch = event => {
    this.loadDiagnosisHistory({ search: event.target.value });
  };
  handleVisitSearch = event => {};

  handleMenuSelection = value => {
    this.setState({
      currentMenu: value,
      selectedRemark: null,
    });
  };

  render() {
    let {
      photoTableHeader,
      photoList,
      photoListMeta,
      historyMeta,
      visitMeta,
      compareList,
      currentData,
      currentMenu,
      isAddPhotoOpen,
      isCompareOpen,
      historyList,
      historyTableHeader,
      selectedRemark,
      visitList,
      visitTableHeader,
      isLoading,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid mt-4">
          <div className="row">
            <div className="col-md-12 col-lg-2 mb-4">
              <div className="col-md-12 mb-4">
                <h3 className="head-label">{t("Diagnosis")}</h3>
              </div>
              <Navigation
                activeItemId={currentMenu}
                onSelect={({ itemId }) => this.handleMenuSelection(itemId)}
                items={[
                  {
                    title: t("Photos"),
                    itemId: "/",
                  },
                  {
                    title: t("History"),
                    itemId: "/history",
                  },
                ]}
              />
            </div>
            {isLoading ? (
              <div className="col-md-12 col-lg-10">
                <div className="d-flex mt-5 align-items-center justify-content-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            ) : currentMenu == "/" ? (
              <div className="col-md-12 col-lg-10">
                <div className="col-md-12 mb-4">
                  <div className="row">
                    <div className="col-sm-12 col-md-6 mb-4 p-0">
                      <InputSearch
                        className=""
                        placeholder="Search Photo"
                        onEnter={this.handlePhotosearch}
                      />
                    </div>
                    <div className="col-sm-12 col-md-6 p-0">
                      <NormalButton
                        mainbg={true}
                        className="col-md-10 fs-15 float-right"
                        label="Add Photo"
                        onClick={() => {
                          this.state.currentData = null;
                          this.setState({ isAddPhotoOpen: true });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <div className="table-container">
                    <TableWrapper
                      headerDetails={photoTableHeader}
                      queryHandler={e => this.handlePagination("photo", e)}
                      pageMeta={photoListMeta}
                      showFilterColumn={true}
                      parentHeaderChange={value =>
                        this.setState(() => (photoTableHeader = value))
                      }
                    >
                      {photoList.length > 0
                        ? photoList.map((item, index) => {
                            let {
                              isCompare,
                              pic_path,
                              diagnosis_date,
                              diagnosis_code,
                              sys_code,
                              remarks,
                              pic_data1,
                            } = item;
                            console.log(photoTableHeader[0]);
                            return (
                              <tr key={index}>
                                <td
                                  className={
                                    photoTableHeader[0].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-right">
                                    {new Date(
                                      diagnosis_date
                                    ).toLocaleDateString("en-GB")}
                                  </div>
                                </td>
                                <td
                                  className={
                                    photoTableHeader[1].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-left">
                                    {diagnosis_code}
                                  </div>
                                </td>
                                <td
                                  className={
                                    photoTableHeader[2].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-left">{remarks}</div>
                                </td>
                                <td
                                  className={
                                    photoTableHeader[3].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="d-flex align-items-center justify-content-center">
                                    <input
                                      type="checkbox"
                                      checked={isCompare}
                                      onClick={() => {
                                        photoList[index].isCompare = !isCompare;
                                        this.setState({});
                                      }}
                                    />
                                  </div>
                                </td>
                                <td
                                  className={
                                    photoTableHeader[4].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="d-flex align-items-center justify-content-center">
                                    <div
                                      className="d-flex align-items-center fs-20"
                                      onClick={() =>
                                        this.setState({
                                          currentData: {
                                            image: pic_path,
                                            remarks,
                                            pic_data1,
                                            diagnosis_code: sys_code,
                                          },
                                          isAddPhotoOpen: true,
                                        })
                                      }
                                    >
                                      <span className="icon-eye-grey"></span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </TableWrapper>
                  </div>
                </div>
                {photoList && photoList.filter(e => e.isCompare).length > 0 ? (
                  <div className="w-100 col-4 p-0">
                    <NormalButton
                      mainbg={true}
                      className="col-12 fs-15 float-right"
                      label="Compare"
                      onClick={() => {
                        this.state.selectedRemark = null;
                        this.setState({ isCompareOpen: true });
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : currentMenu == "/history" ? (
              <div className="col-md-12 col-lg-10">
                <div className="col-md-12 mb-4">
                  <div className="row">
                    <div className="col-12 p-0">
                      <InputSearch
                        className=""
                        placeholder="Search History"
                        onEnter={this.handleHistorySearch}
                      />
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <div className="table-container">
                    <TableWrapper
                      headerDetails={historyTableHeader}
                      queryHandler={e => this.handlePagination("history", e)}
                      pageMeta={historyMeta}
                      showFilterColumn={true}
                      parentHeaderChange={value =>
                        this.setState(() => (historyTableHeader = value))
                      }
                    >
                      {historyList
                        ? historyList.map((item, index) => {
                            let {
                              diagnosis_list,
                              compare_datetime,
                              compare_remark,
                              id,
                            } = item;
                            console.log(historyTableHeader[0]);
                            return (
                              <tr key={index}>
                                <td
                                  className={
                                    historyTableHeader[0].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-right">
                                    {new Date(
                                      compare_datetime
                                    ).toLocaleDateString("en-GB")}
                                  </div>
                                </td>
                                <td
                                  className={
                                    historyTableHeader[1].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-left">
                                    {compare_remark}
                                  </div>
                                </td>
                                <td
                                  className={
                                    historyTableHeader[2].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-left">
                                    {diagnosis_list.map(image => (
                                      <>
                                        {image.diagnosis_code} <br />
                                      </>
                                    ))}
                                  </div>
                                </td>
                                <td
                                  className={
                                    historyTableHeader[3].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-right">
                                    {diagnosis_list.map(image => (
                                      <>
                                        {new Date(
                                          image.date_pic_take
                                        ).toLocaleDateString("en-GB")}
                                        <br />
                                      </>
                                    ))}
                                  </div>
                                </td>
                                <td
                                  className={
                                    historyTableHeader[4].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="d-flex align-items-center justify-content-center">
                                    <div
                                      className="d-flex align-items-center fs-20"
                                      onClick={() =>
                                        this.setState({
                                          selectedRemark: compare_remark,
                                          selectedHistoryCode: id,
                                          compareList: diagnosis_list,
                                          isCompareOpen: true,
                                        })
                                      }
                                    >
                                      <span className="icon-eye-grey"></span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </TableWrapper>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-12 col-lg-10">
                <div className="col-md-12 mb-4">
                  <div className="row">
                    <div className="col-12 p-0">
                      <InputSearch
                        className=""
                        placeholder="Search Visit"
                        onEnter={this.handleVisitSearch}
                      />
                    </div>
                  </div>
                </div>
                <div className="table-responsive">
                  <div className="table-container">
                    <TableWrapper
                      headerDetails={visitTableHeader}
                      queryHandler={e => this.handlePagination("visit", e)}
                      pageMeta={visitMeta}
                      showFilterColumn={true}
                      parentHeaderChange={value =>
                        this.setState(() => (visitTableHeader = value))
                      }
                    >
                      {visitList
                        ? visitList.map((item, index) => {
                            let { images, date, remarks } = item;
                            console.log(visitTableHeader[0]);
                            return (
                              <tr key={index}>
                                <td
                                  className={
                                    visitTableHeader[0].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-right">{date}</div>
                                </td>
                                <td
                                  className={
                                    visitTableHeader[1].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-left">{remarks}</div>
                                </td>
                                <td
                                  className={
                                    visitTableHeader[2].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-left">
                                    {images.map(image => (
                                      <>
                                        {image.id} <br />
                                      </>
                                    ))}
                                  </div>
                                </td>
                                <td
                                  className={
                                    visitTableHeader[3].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="text-right">
                                    {images.map(image => (
                                      <>
                                        {image.date} <br />
                                      </>
                                    ))}
                                  </div>
                                </td>
                                <td
                                  className={
                                    visitTableHeader[4].enabled ?? true
                                      ? ""
                                      : "d-none"
                                  }
                                >
                                  <div className="d-flex align-items-center justify-content-center">
                                    <div
                                      className="d-flex align-items-center fs-20"
                                      onClick={() =>
                                        this.setState({
                                          selectedRemark: remarks,
                                          compareList: images,
                                          isCompareOpen: true,
                                        })
                                      }
                                    >
                                      <span className="icon-eye-grey"></span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </TableWrapper>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NormalModal
            style={{ minWidth: "80%" }}
            modal={isAddPhotoOpen}
            handleModal={() => this.setState({ isAddPhotoOpen: false })}
          >
            <img
              onClick={() => this.setState({ isAddPhotoOpen: false })}
              className="close cursor-pointer"
              src={closeIcon}
              alt=""
            />
            <AddPhotoPopup
              image={currentData?.image}
              remarks={currentData?.remarks}
              layoutData={currentData?.pic_data1}
              diagnosis_code={currentData?.diagnosis_code}
              cust_no={this.props.id}
              onDone={() => {
                this.updateState({ isAddPhotoOpen: false });
                this.loadDiagnosisHistory();
                this.loadDiagnosisPhotos();
              }}
            />
          </NormalModal>
          <NormalModal
            style={{ minWidth: "80%" }}
            modal={isCompareOpen}
            handleModal={() => this.setState({ isCompareOpen: false })}
          >
            <img
              onClick={() => this.setState({ isCompareOpen: false })}
              className="close cursor-pointer"
              src={closeIcon}
              alt=""
            />
            <ComparePhotoPopup
              dataList={
                currentMenu == "/"
                  ? photoList && photoList.filter(e => e.isCompare)
                  : compareList
              }
              remarks={currentMenu == "/" ? null : selectedRemark}
              id={this.state.selectedHistoryCode}
              cust_code={this.props.id}
              onDone={() => {
                this.updateState({ isCompareOpen: false });
                this.loadDiagnosisHistory();
                this.loadDiagnosisPhotos();
              }}
            />
          </NormalModal>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  photoList: state.customerPlus.customerDiagnosisPhotoList,
  historyList: state.customerPlus.customerDiagnosisHistory,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getDiagnosisPhotos,
      getDiagnosisHistory,
    },
    dispatch
  );
};

export const Dianosis = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(DianosisClass)
);
