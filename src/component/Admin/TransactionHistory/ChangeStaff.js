import React, { Component } from "react";
import {
  NormalInput,
  NormalButton,
  NormalModal,
  NormalCheckbox,
} from "component/common";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getCommonApi,
  commonCreateApi,
  commonDeleteApi,
} from "redux/actions/common";
import closeIcon from "assets/images/close.png";
import "./style.scss";
import { Toast } from "service/toast";
import { StaffList } from "../Cart/cart/StaffList";
import { withTranslation } from "react-i18next";
import { ChangeCourseTD } from "./ChangeCourseTD";
import { ChangeStaffTD } from "./ChangeStaffTD";

export class ChangeStaffClass extends Component {
  state = {
    data_list: [],
    item_status_options: [],
    staffListPopup: false,
    selectedAddStaffIndex: null,
    staffList: [],
    limit: 6,
    page: 1,
    meta: {},
    sourceList: [],
    selectedAddStaffType: 1,
    activeRow: 0,
    isOpenTreatmentDone: false,
    SelectedItem: [],
  };

  componentDidMount() {
    this.getStaffSelectionList();
  }
  getStafflist = data => {
    let { page, limit, selectedAddStaffType } = this.state;
    this.props
      .getCommonApi(
        `empcartlist/?sales_staff=${selectedAddStaffType}&page=${page}&limit=${limit}`
      )
      .then(async key => {
        let { status, data } = key;
        console.log(key, "sdfgsdfgsdfgdfg sdfgsdfgsdfg");
        let { staffList } = this.state;
        let { meta } = this.state;
        staffList = [];
        meta = {};
        staffList = data;
        meta = data.meta.pagination;
        console.log(meta, "metalist");
        this.setState({
          staffList,
          meta,
        });
      });
  };

  handleNext = async () => {
    let { page } = this.state;
    page = page + 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  handleBack = async () => {
    let { page } = this.state;
    page = page - 1;
    await this.setState({
      page,
    });
    if (page > 0) {
      this.getStafflist();
    }
  };

  getStaffSelectionList = () => {
    let { data_list } = this.state;
    let { TransactionId } = this.props;
    this.props
      .getCommonApi(`changestaffs/?sa_transacno=${TransactionId}`)
      .then(async key => {
        let { status, data } = key;
        if (status === 200) {
          console.log(key, "cartstaffselectionpopuplist");
          data_list = data;
          await this.setState({
            data_list,
          });

          if (this.state.data_list.length > 0) {
            this.setState({
              activeRow: this.state.data_list[0].id,
            });
            document
              .getElementById(this.state.data_list[0].id)
              .classList.toggle("d-none");
          }
        }
      });
  };

  handleStaffChange = async (e, index1, index2) => {
    let { data_list } = this.state;
    let data = this.state.data_list[index1].data[index2];
    if ([e.target.name] == "work") {
      if (
        (this.state.data_list[index1]["type"].toUpperCase() == "SALES" &&
          this.state.data_list[index1]["div"] == "3") ||
        (this.state.data_list[index1]["type"].toUpperCase() == "DEPOSIT" &&
          this.state.data_list[index1]["div"] == "3")
      ) {
        data[[e.target.name]] = e.target.value;
        await this.setState({ data });
      } else {
        Toast({
          type: "error",
          message: "Work staff not allowed for Product",
        });
      }
    } else if ([e.target.name] == "sales_percentage") {
      data[[e.target.name]] = e.target.value;
      data[["priceSalesFlag"]] = true;
      await this.setState({ data });

      data_list[index1]["updateSalesCalcFlag"] = true;
      await this.setState({
        data_list,
      });
    } else if ([e.target.name] == "work_percentage") {
      data[[e.target.name]] = e.target.value;
      data[["priceWorkFlag"]] = true;
      await this.setState({ data });

      data_list[index1]["updateWorkCalcFlag"] = true;
      await this.setState({
        data_list,
      });
    } else {
      data[[e.target.name]] = e.target.value;
      await this.setState({ data });
    }
  };

  handleAccordion = async (id, index) => {
    let { data_list } = this.state;
    await this.setState({
      activeRow: id,
    });
    let elements = document.getElementsByClassName("accordion");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("d-none");
    }
    document.getElementById(id).classList.toggle("d-none");
    console.log(elements);
    let data = data_list[index].data;
    let salesPercentCount = data.filter(
      acc => acc.sales === true && acc.priceSalesFlag == true
    ).length;
    if (salesPercentCount > 0) {
      data_list[index]["updateSalesCalcFlag"] = true;
      await this.setState({
        data,
      });
    } else {
      data_list[index]["updateSalesCalcFlag"] = false;
      await this.setState({
        data_list,
      });
    }

    let workPercentCount = data.filter(
      acc => acc.work === true && acc.priceWorkFlag == true
    ).length;
    if (workPercentCount > 0) {
      data_list[index]["updateWorkCalcFlag"] = true;
      await this.setState({
        data,
      });
    } else {
      data_list[index]["updateWorkCalcFlag"] = false;
      await this.setState({
        data_list,
      });
    }
  };

  handleSelectedStaff = async item => {
    this.handleEmployeePopup();
    let { selectedAddStaffIndex, selectedAddStaffType, data_list } = this.state;
    let data = this.state.data_list[selectedAddStaffIndex].data;

    let filter = data.find(acc => acc.emp_id === item.id);
    if (filter) {
      if (filter.work && selectedAddStaffType == 0) {
        Toast({
          type: "error",
          message: "This staff already found in work staff list",
        });
      }
      if (filter.sales && selectedAddStaffType == 1) {
        Toast({
          type: "error",
          message: "This staff already found in sales staff list",
        });
      } else if (!filter.sales && selectedAddStaffType == 1) {
        filter.sales = true;
        this.handleSalesStaffCalc(selectedAddStaffIndex);
      } else {
        filter.work = true;
        this.handleWorkStaffCalc(selectedAddStaffIndex);
      }
    } else {
      data.push({
        work: selectedAddStaffType == 0 ? true : false,
        sales: selectedAddStaffType == 1 ? true : false,
        staff: item.emp_name,
        emp_id: item.id,
        sales_percentage: 0,
        sales_amount: 0,
        sp: 0,
        work_percentage: 0,
        work_amount: 0,
        wp: 0,
        tmp_workid: null,
        tmp_saleid: null,
      });
      await this.setState({ data });

      selectedAddStaffType == 0
        ? this.handleWorkStaffCalc(selectedAddStaffIndex)
        : this.handleSalesStaffCalc(selectedAddStaffIndex);

      this.setState({
        selectedAddStaffIndex: null,
        selectedAddStaffType: null,
      });
    }
  };
  handleEmployeePopup = () => {
    this.setState(prevState => ({
      staffListPopup: !prevState.staffListPopup,
    }));
  };
  handleAddNewStaff = async (index, type, item) => {
    if (type == 0) {
      if (
        (item["type"].toUpperCase() == "SALES" && item["div"] == "3") ||
        (item["type"].toUpperCase() == "DEPOSIT" && item["div"] == "3")
      ) {
        await this.setState({
          selectedAddStaffIndex: index,
          selectedAddStaffType: type,
          staffList: [],
          meta: {},
          page: 1,
        });
        this.getStafflist();
        this.setState({
          staffListPopup: true,
        });
      } else {
        Toast({
          type: "error",
          message: "Work Staff not allowed for Product",
        });
      }
    } else {
      await this.setState({
        selectedAddStaffIndex: index,
        selectedAddStaffType: type,
        staffList: [],
        meta: {},
        page: 1,
      });
      this.getStafflist();
      this.setState({
        staffListPopup: true,
      });
    }
  };

  handlePostAction = () => {
    let { data_list } = this.state;

    for (let value of data_list) {
      let type = value.type;
      let div = value.div;
      let transamt = Number(value.trans_amt).toFixed(2);
      let work_amount = Number(value.work_amount).toFixed(2);
      let sales_point = Number(value.sales_point);
      let work_point = Number(value.work_point);
      let salesPercent = 0;
      let salesAmount = Number(0);
      let salesPoint = Number(0);
      let workPercent = Number(0);
      let workAmount = Number(0);
      let workPoint = Number(0);
      for (let line of value.data) {
        salesPercent += Number(line.sales_percentage);
        salesAmount += Number(line.sales_amount);
        salesPoint += Number(line.sp);
        workPercent += Number(line.work_percentage);
        workAmount += Number(line.work_amount);
        workPoint += Number(line.wp);

        // if (line.work) {
        //   if (
        //     Number(line.work_amount) <= 0 ||
        //     line.work_amount == null ||
        //     line.work_percentage == null ||
        //     Number(line.work_percentage) <= 0
        //   ) {
        //     Toast({
        //       type: "error",
        //       message:
        //         "Please check Work Staff Amount or Percentage should not be empty or Zero",
        //     });
        //     return false;
        //   }
        // }
        // if (line.sales) {
        //   if (
        //     Number(line.sales_amount) <= 0 ||
        //     line.sales_amount == null ||
        //     line.sales_percentage == null ||
        //     Number(line.sales_percentage) <= 0
        //   ) {
        //     Toast({
        //       type: "error",
        //       message:
        //         "Please check Sales Staff Amount or Percentage should not be empty or Zero",
        //     });
        //     return false;
        //   }
        // }
      }
      if (workPercent > 100 || workAmount > transamt) {
        Toast({
          type: "error",
          message:
            "Please check Work Staff Amount or Percentage should be less than Maximum",
        });
        return false;
      } else if (
        div == "3" &&
        type.toUpperCase() == "DEPOSIT" &&
        workAmount > work_amount
      ) {
        Toast({
          type: "error",
          message:
            "Please check Work amount is should be equal to Max Work Amount",
        });
        return false;
      } else if (salesPercent > 100 || salesAmount > transamt) {
        Toast({
          type: "error",
          message:
            "Please check Sales Amount or percentage should be less than max Amount",
        });
        return false;
      }
    }
    return true;
  };

  handleSubmit = () => {
    let { data_list } = this.state;
    let { TransactionId } = this.props;
    console.log(data_list, "staff selection submit list");
    let result = this.handlePostAction();
    if (result) {
      console.log(data_list, "savedataforstaffselection");
      this.props
        .commonCreateApi(
          `changestaffs/staffs/?sa_transacno=${TransactionId}`,
          data_list
        )
        .then(key => {
          console.log(key, "resultset of staffselection");
          let { status, data } = key;
          if (status == 200) {
            this.props.handleModal();
          }
        });
    }
  };

  handleSalesStaffCalc = async index => {
    let { data_list } = this.state;
    let salesStaffCount = 0;
    for (let line of data_list[index].data) {
      if (line.sales) {
        salesStaffCount += 1;
      }
    }
    let sales_percent = Number(100 / salesStaffCount).toFixed(2);
    let totalsale = sales_percent * salesStaffCount;
    let diff_sales_percent = Number(100 - totalsale).toFixed(2);
    let sales_amount = Number(
      data_list[index]["trans_amt"] / salesStaffCount
    ).toFixed(2);
    let diff_sales_amount = Number(
      data_list[index]["trans_amt"] - sales_amount * salesStaffCount
    ).toFixed(2);
    let salespoints = Number(
      data_list[index]["sales_point"] / salesStaffCount
    ).toFixed(2);
    let diff_salespoints = Number(
      data_list[index]["sales_point"] - salespoints * salesStaffCount
    ).toFixed(2);
    let data = data_list[index].data;
    let salesLength = data.filter(acc => acc.sales === true).length;
    let i = 0;
    let j = 1;
    for (let dataLine of data_list[index].data) {
      if (dataLine.sales) {
        if (j == salesLength) {
          let percent = Number(sales_percent) + Number(diff_sales_percent);
          let amt = Number(sales_amount) + Number(diff_sales_amount);
          let sp = Number(salespoints) + Number(diff_salespoints);
          data[i]["sales_percentage"] = Number(percent).toFixed(2);
          data[i]["sales_amount"] = Number(amt).toFixed(2);
          data[i]["sp"] = Number(sp).toFixed(2);
          data[i]["priceSalesFlag"] = false;
          await this.setState({ data });
        } else {
          data[i]["sales_percentage"] = sales_percent;
          data[i]["sales_amount"] = sales_amount;
          data[i]["sp"] = salespoints;
          data[i]["priceSalesFlag"] = false;
          await this.setState({ data });
        }
        j++;
      }
      i++;
    }
    data_list[index]["updateSalesCalcFlag"] = false;
    await this.setState({
      data_list,
    });
  };
  handleWorkStaffCalc = async index => {
    let { data_list } = this.state;

    let workStaffCount = 0;
    for (let line of data_list[index].data) {
      if (line.work) {
        workStaffCount += 1;
      }
    }

    let work_percent = Number(100 / workStaffCount).toFixed(2);
    let totalwork = work_percent * workStaffCount;
    let diff_work_percent = Number(100 - totalwork).toFixed(2);
    let work_amount = "";
    let diff_work_amount = "";
    if (
      data_list[index].div == "3" &&
      data_list[index].type.toUpperCase() == "DEPOSIT"
    ) {
      work_amount = Number(
        data_list[index]["work_amount"] / workStaffCount
      ).toFixed(2);
      diff_work_amount = Number(
        data_list[index]["work_amount"] - work_amount * workStaffCount
      ).toFixed(2);
    } else {
      work_amount = Number(
        data_list[index]["trans_amt"] / workStaffCount
      ).toFixed(2);
      diff_work_amount = Number(
        data_list[index]["trans_amt"] - work_amount * workStaffCount
      ).toFixed(2);
    }
    let workpoints = Number(
      data_list[index]["work_point"] / workStaffCount
    ).toFixed(2);
    let diff_workpoints = Number(
      data_list[index]["work_point"] - workpoints * workStaffCount
    ).toFixed(2);
    let data = data_list[index].data;
    let i = 0;
    let j = 1;
    let workLength = data.filter(acc => acc.work === true).length;
    for (let line of data_list[index].data) {
      if (line.work) {
        if (j == workLength) {
          let percent = Number(work_percent) + Number(diff_work_percent);
          let amt = Number(work_amount) + Number(diff_work_amount);
          let wp = Number(workpoints) + Number(diff_workpoints);

          data[i]["work_percentage"] = Number(percent).toFixed(2);

          data[i]["work_amount"] = Number(amt).toFixed(2);
          data[i]["priceWorkFlag"] = false;
          data[i]["wp"] = Number(wp).toFixed(2);
          await this.setState({ data });
        } else {
          data[i]["work_percentage"] = work_percent;
          data[i]["work_amount"] = work_amount;
          data[i]["priceWorkFlag"] = false;
          data[i]["wp"] = workpoints;
          await this.setState({ data });
        }
        j++;
      }
      i++;
    }
    data_list[index]["updateWorkCalcFlag"] = false;
    await this.setState({
      data_list,
    });
  };

  handleDeleteStaff = async (e, index1, index2) => {
    let data = this.state.data_list[index1].data[index2];
    let cartId = this.state.data_list[index1].id;
    let Workid = 0;
    let Saleid = 0;
    if (data.tmp_workid == null) {
      Workid = 0;
    } else {
      Workid = data.tmp_workid;
    }
    if (data.tmp_saleid == null) {
      Saleid = 0;
    } else {
      Saleid = data.tmp_saleid;
    }

    let body = {
      sales: data.sales,
      work: data.work,
      cart_id: Number(cartId),
      tmp_workid: Number(Workid),
      tmp_saleid: Number(Saleid),
    };
    console.log(body, "selected row Item for delete");
    if (Number(Saleid) > 0 || Number(Workid) > 0) {
      await this.props
        .commonCreateApi(`cartpopup/staffsdelete/`, body)
        .then(res => {
          let { status } = res;
          if (status == "200") {
            console.log(res, "staffselectionpoppupdeleteresponse");
            let { data_list } = this.state;
            data_list[index1].data.splice(index2, 1);
            this.setState({ data_list });
            if (data.sales && data.work) {
              this.handleWorkStaffCalc(index1);
              this.handleSalesStaffCalc(index1);
            } else if (data.sales && !data.work) {
              this.handleSalesStaffCalc(index1);
            } else if (!data.sales && data.work) {
              this.handleWorkStaffCalc(index1);
            }
            //this.getStaffSelectionList();
          }
        });
    } else {
      let { data_list } = this.state;
      data_list[index1].data.splice(index2, 1);
      this.setState({ data_list });
      if (data.sales && data.work) {
        this.handleWorkStaffCalc(index1);
        this.handleSalesStaffCalc(index1);
      } else if (data.sales && !data.work) {
        this.handleSalesStaffCalc(index1);
      } else if (!data.sales && data.work) {
        this.handleWorkStaffCalc(index1);
      }
    }
  };

  handleWorkPercentFocusOut = async (index, index2) => {
    let { data_list } = this.state;

    let workStaffCount = 0;
    for (let line of data_list[index].data) {
      if (line.work) {
        workStaffCount += 1;
      }
    }
    if (Number(data_list[index].data[index2]["work_percentage"]) <= 100) {
      let ModifiedWork_percent = Number(
        data_list[index].data[index2]["work_percentage"]
      ).toFixed(2);
      let ModifiedWork_amount = 0;
      let ModifiedWorkpoints = Number(
        (ModifiedWork_percent / 100) * data_list[index]["work_point"]
      ).toFixed(2);

      let totalwork = Number(
        Number(100).toFixed(2) - Number(ModifiedWork_percent).toFixed(2)
      ).toFixed(2);
      let work_percent = Number(totalwork / (workStaffCount - 1)).toFixed(2);

      let diff_work_percent = Number(
        totalwork - work_percent * (workStaffCount - 1)
      ).toFixed(2);

      let work_amount = 0;
      let diff_work_amount = 0;
      let totalWorkAmount = 0;
      let totalWorkPoint = Number(
        Number(data_list[index]["work_point"]).toFixed(2) -
          Number(ModifiedWorkpoints).toFixed(2)
      ).toFixed(2);
      let workpoints = Number(totalWorkPoint / (workStaffCount - 1)).toFixed(2);
      let diff_workpoints = Number(
        totalWorkPoint - workpoints * (workStaffCount - 1)
      ).toFixed(2);

      if (
        data_list[index].div == "3" &&
        data_list[index].type.toUpperCase() == "DEPOSIT"
      ) {
        ModifiedWork_amount = Number(
          (ModifiedWork_percent / 100) * data_list[index]["work_amount"]
        ).toFixed(2);

        totalWorkAmount = Number(
          Number(data_list[index]["work_amount"]).toFixed(2) -
            Number(ModifiedWork_amount).toFixed(2)
        ).toFixed(2);
        work_amount = Number(totalWorkAmount / (workStaffCount - 1)).toFixed(2);
        diff_work_amount = Number(
          totalWorkAmount - work_amount * (workStaffCount - 1)
        ).toFixed(2);
      } else {
        ModifiedWork_amount = Number(
          (ModifiedWork_percent / 100) * data_list[index]["trans_amt"]
        ).toFixed(2);

        totalWorkAmount = Number(
          Number(data_list[index]["trans_amt"]).toFixed(2) -
            Number(ModifiedWork_amount).toFixed(2)
        ).toFixed(2);
        work_amount = Number(totalWorkAmount / (workStaffCount - 1)).toFixed(2);
        diff_work_amount = Number(
          totalWorkAmount - work_amount * (workStaffCount - 1)
        ).toFixed(2);
      }

      let data = data_list[index].data;

      data_list[index].data[index2]["work_percentage"] =
        Number(ModifiedWork_percent).toFixed(2);
      data_list[index].data[index2]["work_amount"] =
        Number(ModifiedWork_amount).toFixed(2);
      data_list[index].data[index2]["wp"] =
        Number(ModifiedWorkpoints).toFixed(2);
      await this.setState({ data });

      let workLength = data.filter(
        acc =>
          acc.work === true &&
          acc.staff !== data_list[index].data[index2]["staff"]
      ).length;
      let workData = data.filter(
        acc =>
          acc.work === true &&
          acc.staff !== data_list[index].data[index2]["staff"]
      );
      if (workData) {
        let i = 0;
        let j = 1;

        for (let line of data_list[index].data) {
          if (line.work) {
            if (data_list[index].data[index2]["staff"] === line.staff) {
              data[i]["work_percentage"] = ModifiedWork_percent;
              data[i]["work_amount"] = ModifiedWork_amount;
              data[i]["wp"] = ModifiedWorkpoints;
              await this.setState({ data });
            } else {
              if (j == workLength) {
                let percent = Number(work_percent) + Number(diff_work_percent);
                let amt = Number(work_amount) + Number(diff_work_amount);
                let wp = Number(workpoints) + Number(diff_workpoints);

                data[i]["work_percentage"] = Number(percent).toFixed(2);

                data[i]["work_amount"] = Number(amt).toFixed(2);

                data[i]["wp"] = Number(wp).toFixed(2);
                await this.setState({ data });
              } else {
                data[i]["work_percentage"] = work_percent;
                data[i]["work_amount"] = work_amount;
                data[i]["wp"] = workpoints;
                await this.setState({ data });
              }
              j++;
            }
          }
          i++;
        }
      }
    } else {
      Toast({
        type: "error",
        message: "Please enter valid percentage",
      });
    }
  };

  handleSalesStaffPriceChange = async (e, index, index1) => {
    let { data_list } = this.state;
    let data = data_list[index].data[index1];

    data["priceSalesFlag"] = e.target.value;
    await this.setState({
      data,
    });
    let salesPercentCount = data_list[index].data.filter(
      acc => acc.sales === true && acc.priceSalesFlag == true
    ).length;
    if (salesPercentCount > 0) {
      data_list[index]["updateSalesCalcFlag"] = true;
      await this.setState({ data_list });
    } else {
      data_list[index]["updateSalesCalcFlag"] = false;
      await this.setState({ data_list });
    }
  };

  handleWorkStaffPriceChange = async (e, index, index1) => {
    let { data_list } = this.state;
    let data = data_list[index].data[index1];

    data["priceWorkFlag"] = e.target.value;
    await this.setState({
      data,
    });
    let workPercentCount = data_list[index].data.filter(
      acc => acc.work === true && acc.priceWorkFlag == true
    ).length;
    if (workPercentCount > 0) {
      data_list[index]["updateWorkCalcFlag"] = true;
      await this.setState({ data_list });
    } else {
      data_list[index]["updateWorkCalcFlag"] = false;
      await this.setState({ data_list });
    }
  };
  handleSalesPercentCalcUpdate = async index => {
    let { data_list } = this.state;

    let salesStaffCount = 0;
    for (let line of data_list[index].data) {
      if (line.sales) {
        salesStaffCount += 1;
      }
    }
    let data = data_list[index].data;
    let salesPercentChange = data.filter(
      acc => acc.sales === true && acc.priceSalesFlag == true
    );
    let salesStaffBalancePercent = 0;
    if (salesPercentChange) {
      for (let percentLine of salesPercentChange) {
        if (percentLine.sales) {
          salesStaffBalancePercent += Number(percentLine.sales_percentage);
        }
      }
    }
    if (salesPercentChange && salesStaffBalancePercent > 100) {
      Toast({
        type: "error",
        message: "Percentage should be less than 100",
      });
    } else {
      let salesPercentCount = data.filter(
        acc => acc.sales === true && acc.priceSalesFlag == true
      ).length;
      let ModifiedSales_percent = Number(
        100 - salesStaffBalancePercent
      ).toFixed(2);
      let Modifiedsales_amount = Number(
        (ModifiedSales_percent / 100) * data_list[index]["trans_amt"]
      ).toFixed(2);
      let Modifiedsalespoints = Number(
        (ModifiedSales_percent / 100) * data_list[index]["sales_point"]
      ).toFixed(2);

      let sales_percent = Number(
        ModifiedSales_percent / (salesStaffCount - salesPercentCount)
      ).toFixed(2);

      let diff_sales_percent = Number(
        ModifiedSales_percent -
          sales_percent * (salesStaffCount - salesPercentCount)
      ).toFixed(2);

      let sales_amount = Number(
        Modifiedsales_amount / (salesStaffCount - salesPercentCount)
      ).toFixed(2);
      let diff_sales_amount = Number(
        Modifiedsales_amount -
          sales_amount * (salesStaffCount - salesPercentCount)
      ).toFixed(2);

      let salespoints = Number(
        Modifiedsalespoints / (salesStaffCount - salesPercentCount)
      ).toFixed(2);
      let diff_salespoints = Number(
        Modifiedsalespoints -
          salespoints * (salesStaffCount - salesPercentCount)
      ).toFixed(2);

      let i = 0;
      let j = 1;
      for (let dataLine of data_list[index].data) {
        if (dataLine.sales) {
          if (dataLine.priceSalesFlag) {
            let LineSales_percent = Number(dataLine.sales_percentage).toFixed(
              2
            );
            let Linesales_amount = Number(
              (LineSales_percent / 100) * data_list[index]["trans_amt"]
            ).toFixed(2);
            let Linesalespoints = Number(
              (LineSales_percent / 100) * data_list[index]["sales_point"]
            ).toFixed(2);

            data[i]["sales_percentage"] = LineSales_percent;
            data[i]["sales_amount"] = Linesales_amount;
            data[i]["sp"] = Linesalespoints;
            data[i]["priceSalesFlag"] = false;
            await this.setState({ data });
          } else {
            if (j == salesPercentCount) {
              let percent = Number(sales_percent) + Number(diff_sales_percent);
              let amt = Number(sales_amount) + Number(diff_sales_amount);
              let sp = Number(salespoints) + Number(diff_salespoints);
              data[i]["sales_percentage"] = Number(percent).toFixed(2);
              data[i]["sales_amount"] = Number(amt).toFixed(2);
              data[i]["sp"] = Number(sp).toFixed(2);
              data[i]["priceSalesFlag"] = false;
              await this.setState({ data });
            } else {
              data[i]["sales_percentage"] = sales_percent;
              data[i]["sales_amount"] = sales_amount;
              data[i]["sp"] = salespoints;
              data[i]["priceSalesFlag"] = false;
              await this.setState({ data });
            }
            j++;
          }
        }
        i++;
      }
      data_list[index]["updateSalesCalcFlag"] = false;
      await this.setState({
        data_list,
      });
    }
  };

  handleWorkPercentCalcUpdate = async index => {
    let { data_list } = this.state;

    let WorkStaffCount = 0;
    for (let line of data_list[index].data) {
      if (line.work) {
        WorkStaffCount += 1;
      }
    }
    let data = data_list[index].data;
    let workPercentChange = data.filter(
      acc => acc.work === true && acc.priceWorkFlag == true
    );
    let workStaffBalancePercent = 0;
    if (workPercentChange) {
      for (let percentLine of workPercentChange) {
        if (percentLine.work) {
          workStaffBalancePercent += Number(percentLine.work_percentage);
        }
      }
    }
    if (workPercentChange && workStaffBalancePercent > 100) {
      Toast({
        type: "error",
        message: "Percentage should be less than 100",
      });
    } else {
      let workPercentCount = data.filter(
        acc => acc.work === true && acc.priceWorkFlag == true
      ).length;
      let ModifiedWork_percent = Number(100 - workStaffBalancePercent).toFixed(
        2
      );
      let ModifiedWork_amount = 0;
      if (
        data_list[index].div == "3" &&
        data_list[index].type.toUpperCase() == "DEPOSIT"
      ) {
        ModifiedWork_amount = Number(
          (ModifiedWork_percent / 100) * data_list[index]["work_amount"]
        ).toFixed(2);
      } else {
        ModifiedWork_amount = Number(
          (ModifiedWork_percent / 100) * data_list[index]["trans_amt"]
        ).toFixed(2);
      }
      let ModifiedWorkpoints = Number(
        (ModifiedWork_percent / 100) * data_list[index]["work_point"]
      ).toFixed(2);

      let work_percent = Number(
        ModifiedWork_percent / (WorkStaffCount - workPercentCount)
      ).toFixed(2);

      let diff_work_percent = Number(
        ModifiedWork_percent -
          work_percent * (WorkStaffCount - workPercentCount)
      ).toFixed(2);

      let work_amount = Number(
        ModifiedWork_amount / (WorkStaffCount - workPercentCount)
      ).toFixed(2);
      let diff_work_amount = Number(
        ModifiedWork_amount - work_amount * (WorkStaffCount - workPercentCount)
      ).toFixed(2);

      let workpoints = Number(
        ModifiedWorkpoints / (WorkStaffCount - workPercentCount)
      ).toFixed(2);
      let diff_workpoints = Number(
        ModifiedWorkpoints - workpoints * (WorkStaffCount - workPercentCount)
      ).toFixed(2);

      let i = 0;
      let j = 1;
      for (let dataLine of data_list[index].data) {
        if (dataLine.work) {
          if (dataLine.priceWorkFlag) {
            let LineWork_percent = Number(dataLine.work_percentage).toFixed(2);
            let LineWork_amount = 0;
            if (
              data_list[index].div == "3" &&
              data_list[index].type.toUpperCase() == "DEPOSIT"
            ) {
              LineWork_amount = Number(
                (LineWork_percent / 100) * data_list[index]["work_amount"]
              ).toFixed(2);
            } else {
              LineWork_amount = Number(
                (LineWork_percent / 100) * data_list[index]["trans_amt"]
              ).toFixed(2);
            }

            let Lineworkspoints = Number(
              (LineWork_percent / 100) * data_list[index]["work_point"]
            ).toFixed(2);

            data[i]["work_percentage"] = LineWork_percent;
            data[i]["work_amount"] = LineWork_amount;
            data[i]["wp"] = Lineworkspoints;
            data[i]["priceWorkFlag"] = false;
            await this.setState({ data });
          } else {
            if (j == workPercentCount) {
              let percent = Number(work_percent) + Number(diff_work_percent);
              let amt = Number(work_amount) + Number(diff_work_amount);
              let wp = Number(workpoints) + Number(diff_workpoints);
              data[i]["work_percentage"] = Number(percent).toFixed(2);
              data[i]["work_amount"] = Number(amt).toFixed(2);
              data[i]["wp"] = Number(wp).toFixed(2);
              data[i]["priceWorkFlag"] = false;
              await this.setState({ data });
            } else {
              data[i]["work_percentage"] = work_percent;
              data[i]["work_amount"] = work_amount;
              data[i]["wp"] = workpoints;
              data[i]["priceWorkFlag"] = false;
              await this.setState({ data });
            }
            j++;
          }
        }
        i++;
      }
      data_list[index]["updateWorkCalcFlag"] = false;
      await this.setState({
        data_list,
      });
    }
  };

  handleTreatmentDone = async data => {
    await this.setState({ SelectedItem: data });
    this.setState({ isOpenTreatmentDone: true });
  };

  handleDialog = async () => {
    let { isOpenTreatmentDone } = this.state;
    isOpenTreatmentDone = false;
    await this.setState({
      isOpenTreatmentDone,
    });
    this.getStaffSelectionList();
  };

  render() {
    let {
      data_list,
      staffListPopup,
      staffList,
      meta,
      activeRow,
      isOpenTreatmentDone,
      SelectedItem,
    } = this.state;
    let { t } = this.props;
    return (
      <>
        <div className="container-fluid mb-4 mt-2 product-details">
          <div className="row">
            <div className="col-8">
              <h4>{t("Staff Selection")}</h4>
            </div>
            {data_list && data_list.length > 0 ? (
              <>
                <div className="col-md-2"></div>
                <div className="col-md-2">
                  <NormalButton
                    mainbg={false}
                    className="col-12 fs-15 submit-btn"
                    label="Done"
                    onClick={() => this.handleSubmit()}
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="row pl-3 pr-5 mt-2 fw-500 h6">
            <div className="col-3">{`Item`}</div>
            <div className="col-1 text-center">{`Qty`}</div>
            <div className="col text-right">{`Unit Price`}</div>
            <div className="col text-right">{`Disc $`}</div>
            <div className="col text-right">{`D/Price`}</div>
            <div className="col text-right">{`Amount`}</div>
            <div className="col text-right">{`Deposit`}</div>
          </div>
          <div className="row pl-5 pr-5 mt-4 overflow-auto">
            {data_list &&
              data_list.length > 0 &&
              data_list.map((item, index) => {
                return (
                  <div className="row  mb-2" key={index}>
                    <div
                      className={`row rounded p-2 accordion-menu border staff ${
                        activeRow == item.id ? "border-primary" : ""
                      }`}
                      onClick={() => this.handleAccordion(item.id, index)}
                    >
                      <div className="col-3">{item.itemdesc}</div>
                      <div className="col-1 text-center">
                        {item.quantity}
                        {/* <NormalInput
                          name="quantity"
                          type="number"
                          value={item.quantity}
                          onChange={e => this.handleChange(e, index)}
                        /> */}
                      </div>
                      <div className="col text-right">{item.price}</div>
                      <div className="col text-right">{item.totl_disc}</div>
                      <div className="col text-right">
                        {item.discount_price}
                      </div>
                      <div className="col text-right">{item.trans_amt}</div>
                      <div className="col text-right">{item.deposit}</div>
                    </div>
                    <div
                      className="row  rounded bg-light p-1 d-none accordion"
                      id={item.id}
                    >
                      <div className="mb-3">
                        <table className="table" style={{ marginRight: 10 }}>
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="border-top-0 border-bottom-0 salesstaff-background"
                                colSpan="1"
                              >
                                <div className="row">
                                  <div className="col">
                                    <NormalButton
                                      mainbg={true}
                                      className="col-12 fs-15 fw-500"
                                      label="Add"
                                      onClick={() =>
                                        this.handleAddNewStaff(index, 1, item)
                                      }
                                    />
                                  </div>
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="text-center border-right border-left border-top-0 border-bottom-0 salesstaff-background"
                                colSpan="3"
                              >
                                <div className="row">
                                  <div className="col-6">
                                    {t("Sales staff")}
                                  </div>

                                  <div className="col">
                                    {item.updateSalesCalcFlag ? (
                                      <NormalButton
                                        mainbg={true}
                                        className="col-12 top-0"
                                        label="Calc"
                                        onClick={() =>
                                          this.handleSalesPercentCalcUpdate(
                                            index
                                          )
                                        }
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="col">
                                    <NormalButton
                                      mainbg={true}
                                      className="col-12 top-0"
                                      label="Auto"
                                      onClick={() =>
                                        this.handleSalesStaffCalc(index)
                                      }
                                    />
                                  </div>
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="border-top-0 border-bottom-0 workstaff-background"
                                colSpan="1"
                              >
                                <div className="row">
                                  <div className="col">
                                    <NormalButton
                                      mainbg={true}
                                      className="col-12 fs-15 fw-500"
                                      label="Add"
                                      onClick={() =>
                                        this.handleAddNewStaff(index, 0, item)
                                      }
                                    />
                                  </div>
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="text-center border-top-0 border-bottom-0 workstaff-background"
                                colSpan="3"
                              >
                                <div className="row">
                                  <div className="col-5">{t("Work staff")}</div>
                                  <div className="col">
                                    {item.updateWorkCalcFlag ? (
                                      <NormalButton
                                        mainbg={true}
                                        className="col-12 top-0"
                                        label="Calc"
                                        onClick={() =>
                                          this.handleWorkPercentCalcUpdate(
                                            index
                                          )
                                        }
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                  <div className="col">
                                    <NormalButton
                                      mainbg={true}
                                      className="col-12"
                                      label="Auto"
                                      onClick={() =>
                                        this.handleWorkStaffCalc(index)
                                      }
                                    />
                                  </div>
                                </div>
                              </th>
                              <th rowSpan="1">
                                <div className="col">
                                  {Number(item.sessiondone) > 0 &&
                                  String(item.type).toUpperCase() ===
                                    "DEPOSIT" &&
                                  Number(item.div) === 3 ? (
                                    <NormalButton
                                      mainbg={true}
                                      className="col-12"
                                      label="TD"
                                      onClick={() =>
                                        this.handleTreatmentDone(item)
                                      }
                                    />
                                  ) : (
                                    ""
                                  )}

                                  {Number(item.td_session) > 0 &&
                                  String(item.type).toUpperCase() ===
                                    "SALES" ? (
                                    <NormalButton
                                      mainbg={true}
                                      className="col-12"
                                      label="TD"
                                      onClick={() =>
                                        this.handleTreatmentDone(item)
                                      }
                                    />
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </th>
                            </tr>
                            <tr>
                              <th
                                scope="col"
                                className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                              >
                                {t("Staff")}
                              </th>
                              <th
                                scope="col"
                                className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                              >
                                % ({`100`})
                              </th>
                              <th
                                scope="col"
                                className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                              >
                                $ ({item.trans_amt})
                              </th>
                              <th
                                scope="col"
                                className="text-center border-right border-top-0 border-bottom-0 salesstaff-background"
                              >
                                SP ({item.sales_point})
                              </th>
                              <th
                                scope="col"
                                className="text-center border-right border-top-0 border-bottom-0 workstaff-background"
                              >
                                {t("Staff")}
                              </th>
                              <th
                                scope="col"
                                className="text-center border-right border-top-0 border-bottom-0 workstaff-background"
                              >
                                % ({`100`})
                              </th>
                              <th
                                scope="col"
                                className="text-center border-right border-top-0 border-bottom-0 workstaff-background"
                              >
                                $ (
                                {item.type.toUpperCase() == "DEPOSIT" &&
                                item.div == "3"
                                  ? item.work_amount
                                  : item.trans_amt}
                                )
                              </th>
                              <th
                                scope="col"
                                className="text-center border-top-0 border-bottom-0 workstaff-background"
                              >
                                {t("WP")} ({item.work_point})
                              </th>
                              <th rowSpan="1">{t("Action")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data_list[index].data.length <= 0 ? (
                              <tr>
                                <div className="d-flex justify-content-center">
                                  {t("No record found")}
                                </div>
                              </tr>
                            ) : null}
                            {data_list[index].data.map((data, index2) => {
                              return (
                                <tr key={index2}>
                                  <th
                                    scope="col"
                                    className="text-center d-none workstaff-background"
                                  >
                                    <NormalCheckbox
                                      type="checkbox"
                                      checked={data.sales}
                                      name="sales"
                                      onChange={e =>
                                        this.handleStaffChange(e, index, index2)
                                      }
                                    />
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center d-none"
                                  >
                                    <NormalCheckbox
                                      type="checkbox"
                                      checked={data.work}
                                      name="work"
                                      onChange={e =>
                                        this.handleStaffChange(e, index, index2)
                                      }
                                    />
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center border-right salesstaff-background"
                                  >
                                    <label className="text-left text-black common-label-text pb-2">
                                      {data.staff}
                                    </label>
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center border-right salesstaff-background"
                                  >
                                    <div className="d-flex flex-nowrap">
                                      <div className="col-9">
                                        <NormalInput
                                          name="sales_percentage"
                                          type="number"
                                          value={
                                            data.sales && data.sales_percentage
                                              ? data.sales_percentage
                                              : ""
                                          }
                                          onChange={e =>
                                            this.handleStaffChange(
                                              e,
                                              index,
                                              index2
                                            )
                                          }
                                          disabled={data.sales ? false : true}
                                        />
                                      </div>
                                      <div className="col-3">
                                        <NormalCheckbox
                                          type="checkbox"
                                          checked={
                                            data.priceSalesFlag ? true : false
                                          }
                                          name="priceSalesFlag"
                                          onChange={e =>
                                            this.handleSalesStaffPriceChange(
                                              e,
                                              index,
                                              index2
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center border-right salesstaff-background"
                                  >
                                    <NormalInput
                                      name="sales_amount"
                                      type="number"
                                      value={
                                        data.sales && data.sales_amount
                                          ? data.sales_amount
                                          : ""
                                      }
                                      onChange={e =>
                                        this.handleStaffChange(e, index, index2)
                                      }
                                      disabled={data.sales ? false : true}
                                    />
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center border-right salesstaff-background"
                                  >
                                    <NormalInput
                                      name="sp"
                                      type="number"
                                      value={data.sp}
                                      onChange={e =>
                                        this.handleStaffChange(e, index, index2)
                                      }
                                      disabled={data.sales ? false : true}
                                    />
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center border-right workstaff-background"
                                  >
                                    <label className="text-left text-black common-label-text pb-2">
                                      {data.staff}
                                    </label>
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center border-right workstaff-background"
                                  >
                                    <div className="d-flex flex-nowrap">
                                      <div className="col-9">
                                        <NormalInput
                                          name="work_percentage"
                                          type="number"
                                          value={
                                            data.work && data.work_percentage
                                              ? data.work_percentage
                                              : ""
                                          }
                                          onChange={e =>
                                            this.handleStaffChange(
                                              e,
                                              index,
                                              index2
                                            )
                                          }
                                          disabled={data.work ? false : true}
                                        />
                                      </div>
                                      <div className="col-3">
                                        <NormalCheckbox
                                          type="checkbox"
                                          checked={
                                            data.priceWorkFlag ? true : false
                                          }
                                          name="priceWorkFlag"
                                          onChange={e =>
                                            this.handleWorkStaffPriceChange(
                                              e,
                                              index,
                                              index2
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center border-right workstaff-background"
                                  >
                                    <NormalInput
                                      name="work_amount"
                                      type="number"
                                      value={
                                        data.work && data.work_amount
                                          ? data.work_amount
                                          : ""
                                      }
                                      onChange={e =>
                                        this.handleStaffChange(e, index, index2)
                                      }
                                      disabled={data.work ? false : true}
                                    />
                                  </th>
                                  <th
                                    scope="col"
                                    className="text-center workstaff-background"
                                  >
                                    <NormalInput
                                      name="wp"
                                      type="number"
                                      value={data.wp}
                                      onChange={e =>
                                        this.handleStaffChange(e, index, index2)
                                      }
                                      disabled={data.work ? false : true}
                                    />
                                  </th>
                                  <th>
                                    <div
                                      className="col-12 p-0 fs-18 text-center cursor-pointer"
                                      onClick={e =>
                                        this.handleDeleteStaff(e, index, index2)
                                      }
                                    >
                                      <span className="icon-delete"></span>
                                    </div>
                                  </th>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {data_list && data_list.length <= 0 ? (
            <div className="row pl-5 pr-5 mt-4">{t("No Record Found")}</div>
          ) : null}
          <NormalModal
            className={"stock-memo-staff-listing"}
            style={{ minWidth: "75%" }}
            modal={staffListPopup}
            handleModal={this.handleEmployeePopup}
          >
            <img
              onClick={this.handleEmployeePopup}
              className="close"
              src={closeIcon}
              alt=""
            />
            <StaffList
              staffList={staffList}
              meta={meta}
              handleNext={() => this.handleNext()}
              handleBack={() => this.handleBack()}
              handleSelectedStaff={item => this.handleSelectedStaff(item)}
            />
          </NormalModal>
          <NormalModal
            className={"transaction-done-modal"}
            style={{ minWidth: "60%" }}
            modal={isOpenTreatmentDone}
            handleModal={this.handleDialog}
          >
            <img
              onClick={this.handleDialog}
              className="close cursor-pointer"
              src={closeIcon}
              alt=""
            />
            {String(SelectedItem.type).toUpperCase() === "DEPOSIT" &&
            Number(SelectedItem.div) === 3 ? (
              <ChangeCourseTD
                //id={cartId}
                cartId={SelectedItem.id}
                treatmentId={SelectedItem.treatment_ids}
                sessionCount={SelectedItem.sessiondone}
                depositAmt={SelectedItem.deposit}
                handleModal={this.handleDialog}
              ></ChangeCourseTD>
            ) : (
              ""
            )}
            {String(SelectedItem.type).toUpperCase() === "SALES" ? (
              <ChangeStaffTD
                id={SelectedItem.treatment_ids}
                session={SelectedItem.td_session}
                cartId={SelectedItem.id}
                handleModal={this.handleDialog}
              ></ChangeStaffTD>
            ) : (
              ""
            )}
          </NormalModal>
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
      commonDeleteApi,
    },
    dispatch
  );
};

export const ChangeStaff = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ChangeStaffClass)
);
