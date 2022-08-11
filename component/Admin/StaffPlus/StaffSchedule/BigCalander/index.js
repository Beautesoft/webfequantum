import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "./style.scss";

class BigCalanderClass extends Component {
  state = {
    selectedMonth: "",
  };
  componentWillMount() {
    const date = new Date();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    this.setState({ selectedMonth: `${year}-${month}` });
  }
  componentDidMount() {
    for (
      let staffIndex = 0;
      staffIndex < this.props.data.length;
      staffIndex++
    ) {
      let staff = this.props.data[staffIndex];
      for (let index = 0; index <= staff?.schedules?.length; index++) {
        let anchor = document.getElementById(
          staff.emp_code + index
        )?.parentElement;
        if (anchor) {
          anchor.onclick = () => {
            if (this.props.disabled ?? false) return;
            document
              .getElementById(staff.emp_code + index)
              .classList.toggle("show");
          };
        }
      }
    }
  }
  componentDidUpdate() {
    var tableData = document.getElementsByTagName("TD");
    for (var i = 0; i < tableData.length; i++) {
      var td = tableData[i];
      td.onclick = null;
    }

    for (
      let staffIndex = 0;
      staffIndex < this.props.data.length;
      staffIndex++
    ) {
      let staff = this.props.data[staffIndex];
      for (let index = 0; index <= staff.schedules.length; index++) {
        let anchor = document.getElementById(staff.name + index)?.parentElement;
        if (anchor) {
          anchor.onclick = () => {
            if (this.props.disabled ?? false) return;
            document
              .getElementById(staff.name + index)
              .classList.toggle("show");
          };
        }
      }
    }
  }
  render() {
    let {
      date = this.state.selectedMonth,
      data = [
        {
          emp_name: "TestTherapist",
          emp_code: "EMP100001",
          schedules: [
            { id: 7971, date: "2021-06-01T00:00:00", itm_type: "100010" },
            { id: 7971, date: "2021-06-02T00:00:00", itm_type: "100010" },
          ],
        },
      ],
      options,
      onChange,
      disabled = false,
      t,
    } = this.props;
    console.log(data);
    let d = new Date(date);
    let lastDayDate = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

    const handOnOptionClick = (staffIndex, index, value) => {
      if (disabled) return;
      data[staffIndex].schedules[index].itm_type = value;
      onChange(data);
    };

    const headers = [];

    for (let index = 1; index <= lastDayDate; index++) {
      headers.push(<th className="text-dark">{index}</th>);
    }
    const rows = [];
    for (let staffIndex = 0; staffIndex < data.length; staffIndex++) {
      let staff = data[staffIndex];
      rows.push(
        <tr>
          <th className="table-header-color text-dark">{staff.emp_name}</th>
          {staff.schedules.map((data, index) => (
            <td
              style={{
                backgroundColor:
                  options.find((val) => val.value == data.itm_type) != null
                    ? options.find((val) => val.value == data.itm_type).color
                    : "white",
              }}
            >
              {t(
                options.find((val) => val.value == data.itm_type) != null
                  ? options.find((val) => val.value == data.itm_type).shortDesc
                  : "N/A"
              )}
              <div id={staff.emp_code + index} class="dropdown-content">
                <label
                  onClick={() => handOnOptionClick(staffIndex, index, "e")}
                >
                  empty
                </label>
                <label
                  onClick={() => handOnOptionClick(staffIndex, index, "o")}
                >
                  option 1
                </label>
                <label
                  onClick={() => handOnOptionClick(staffIndex, index, "w")}
                >
                  option 2
                </label>
              </div>
            </td>
          ))}
        </tr>
      );
    }
    return (
      <div class="table-responsive">
        <table className="table">
          <thead>
            <tr className="table-header-color">
              <th className="text-dark">{t("Staff")}</th>
              {headers}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

export const BigCalander = withTranslation()(BigCalanderClass);
