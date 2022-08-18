import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "./style.scss";

class CalenderTableClass extends Component {
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
    for (let index = 1; index <= 31; index++) {
      let anchor = document.getElementById(index)?.parentElement;
      if (anchor) {
        anchor.onclick = () => {
          let sections = document.querySelectorAll(".dropdown-content");
          for (let i = 0; i < sections.length; i++) {
            sections[i].classList.remove("show");
            // querySelectorAll return an array of dom elements, u can access them directly.
          }
          if (this.props.disabled ?? false) return;
          document.getElementById(index).classList.toggle("show");
        };
      }
    }
  }
  componentDidUpdate() {
    var tableData = document.getElementsByTagName("TD");
    for (var i = 0; i < tableData.length; i++) {
      var td = tableData[i];
      td.onclick = null;
    }

    for (let index = 1; index <= 31; index++) {
      let anchor = document.getElementById(index)?.parentElement;
      if (anchor) {
        anchor.onclick = () => {
          let sections = document.querySelectorAll(".dropdown-content");
          for (let i = 0; i < sections.length; i++) {
            sections[i].classList.remove("show");
            // querySelectorAll return an array of dom elements, u can access them directly.
          }
          if (this.props.disabled ?? false) return;
          document.getElementById(index).classList.toggle("show");
        };
      }
    }
  }
  render() {
    let {
      date = this.state.selectedMonth,
      data = [],
      onChange,
      optionList,
      disabled = false,
      t,
    } = this.props;

    const handOnOptionClick = (index, value) => {
      let sections = document.querySelectorAll(".dropdown-content");
      for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("show");
        // querySelectorAll return an array of dom elements, u can access them directly.
      }
      if (disabled) return;
      var d = new Date(date);
      var newDate = new Date(d.getFullYear(), d.getMonth(), index);
      var obj = data.find(
        e => newDate.getTime() === new Date(e.itm_date).getTime()
      );
      data[data.indexOf(obj)].itm_type = value;
      onChange(data);
    };
    const getDate = index => {
      var d = new Date(date);
      var firstDayDate = new Date(d.getFullYear(), d.getMonth(), 1);
      var lastDayDate = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0
      ).getDate();
      var startIndex = firstDayDate.getDay() == 0 ? 7 : firstDayDate.getDay();
      var currentDate = index - startIndex + 1;
      if (currentDate <= 0) return;
      if (currentDate > lastDayDate) return;
      var newDate = new Date(d.getFullYear(), d.getMonth(), currentDate);
      var itm_type = data.find(
        e => newDate.getTime() === new Date(e.itm_date).getTime()
      )?.itm_type;
      return (
        <>
          {currentDate}
          <br />(
          {t(
            optionList.find(val => val.value == itm_type) != null
              ? optionList.find(val => val.value == itm_type).shortDesc
              : "N/A"
          )}
          )
          <div id={currentDate} class="dropdown-content">
            {optionList.map(val => {
              return (
                <label
                  style={{ cursor: "pointer" }}
                  key={"ws" + val.id}
                  onClick={() => {}}
                  onDoubleClick={() =>
                    handOnOptionClick(currentDate, val.value)
                  }
                >
                  {t(val.label)}
                </label>
              );
            })}
          </div>
        </>
      );
    };

    const getStyle = index => {
      var d = new Date(date);
      var firstDayDate = new Date(d.getFullYear(), d.getMonth(), 1);
      var lastDayDate = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0
      ).getDate();
      var startIndex = firstDayDate.getDay() == 0 ? 7 : firstDayDate.getDay();
      var currentDate = index - startIndex + 1;
      if (currentDate <= 0) return;
      if (currentDate > lastDayDate) return;
      var newDate = new Date(d.getFullYear(), d.getMonth(), currentDate);
      var itm_type = data.find(
        e => newDate.getTime() === new Date(e.itm_date).getTime()
      )?.itm_type;
      return {
        backgroundColor:
          optionList.find(val => val.value == itm_type) != null
            ? optionList.find(val => val.value == itm_type).color
            : "white",
        cursor: "pointer",
      };
    };
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr className="table-header-color">
              <th className="text-dark">Mon</th>
              <th className="text-dark">Tue</th>
              <th className="text-dark">Wed</th>
              <th className="text-dark">Thu</th>
              <th className="text-dark">Fri</th>
              <th className="text-danger">Sat</th>
              <th className="text-danger">Sun</th>
            </tr>
          </thead>
          {data.length == 0 ? null : (
            <tbody>
              <tr>
                <td style={getStyle(1)}>{getDate(1)}</td>
                <td style={getStyle(2)}>{getDate(2)}</td>
                <td style={getStyle(3)}>{getDate(3)}</td>
                <td style={getStyle(4)}>{getDate(4)}</td>
                <td style={getStyle(5)}>{getDate(5)}</td>
                <td style={getStyle(6)}>{getDate(6)}</td>
                <td style={getStyle(7)}>{getDate(7)}</td>
              </tr>
              <tr>
                <td style={getStyle(8)}>{getDate(8)}</td>
                <td style={getStyle(9)}>{getDate(9)}</td>
                <td style={getStyle(10)}>{getDate(10)}</td>
                <td style={getStyle(11)}>{getDate(11)}</td>
                <td style={getStyle(12)}>{getDate(12)}</td>
                <td style={getStyle(13)}>{getDate(13)}</td>
                <td style={getStyle(14)}>{getDate(14)}</td>
              </tr>
              <tr>
                <td style={getStyle(15)}>{getDate(15)}</td>
                <td style={getStyle(16)}>{getDate(16)}</td>
                <td style={getStyle(17)}>{getDate(17)}</td>
                <td style={getStyle(18)}>{getDate(18)}</td>
                <td style={getStyle(19)}>{getDate(19)}</td>
                <td style={getStyle(20)}>{getDate(20)}</td>
                <td style={getStyle(21)}>{getDate(21)}</td>
              </tr>
              <tr>
                <td style={getStyle(22)}>{getDate(22)}</td>
                <td style={getStyle(23)}>{getDate(23)}</td>
                <td style={getStyle(24)}>{getDate(24)}</td>
                <td style={getStyle(25)}>{getDate(25)}</td>
                <td style={getStyle(26)}>{getDate(26)}</td>
                <td style={getStyle(27)}>{getDate(27)}</td>
                <td style={getStyle(28)}>{getDate(28)}</td>
              </tr>
              <tr>
                <td style={getStyle(29)}>{getDate(29)}</td>
                <td style={getStyle(30)}>{getDate(30)}</td>
                <td style={getStyle(31)}>{getDate(31)}</td>
                <td style={getStyle(32)}>{getDate(32)}</td>
                <td style={getStyle(33)}>{getDate(33)}</td>
                <td style={getStyle(34)}>{getDate(34)}</td>
                <td style={getStyle(35)}>{getDate(35)}</td>
              </tr>
              <tr>
                <td style={getStyle(36)}>{getDate(36)}</td>
                <td style={getStyle(37)}>{getDate(37)}</td>
                <td style={getStyle(38)}>{getDate(38)}</td>
                <td style={getStyle(39)}>{getDate(39)}</td>
                <td style={getStyle(40)}>{getDate(40)}</td>
                <td style={getStyle(41)}>{getDate(41)}</td>
                <td style={getStyle(42)}>{getDate(42)}</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    );
  }
}

export const CalenderTable = withTranslation()(CalenderTableClass);
