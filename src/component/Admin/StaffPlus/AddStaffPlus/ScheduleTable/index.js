import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class ScheduleTableClass extends Component {
  render() {
    let {
      onChange,
      data = {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      optionList = [],
      disabled = false,
      t,
    } = this.props;

    const handleOnClick = (name) => {
      if (this.props.disabled ?? false) return;
      document.getElementById(name).classList.toggle("show");
    };

    const handOnOptionClick = (index, value) => {
      if (disabled) return;
      data[index] = value;
      onChange(data);
    };
    console.log(optionList);
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th>Mon</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu</th>
              <th>Fri</th>
              <th>Sat</th>
              <th>Sun</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.keys(data).map(function (keyName) {
                return (
                  <td
                    onClick={() => handleOnClick(keyName)}
                    style={{
                      backgroundColor:
                        optionList.find((val) => val.value == data[keyName]) !=
                        null
                          ? optionList.find((val) => val.value == data[keyName])
                              .color
                          : "white",
                      cursor: "pointer",
                    }}
                  >
                    {t(
                      optionList.find((val) => val.value == data[keyName])
                        ?.shortDesc ?? "None"
                    )}
                    <div id={keyName} class="dropdown-content">
                      {optionList.map((val) => {
                        return (
                          <label
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handOnOptionClick(keyName, val.value)
                            }
                          >
                            {t(val.label)}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        <div className="row m-2">
          {optionList.map((e) => {
            return (
              <div className="col-md-6 col-lg-4 col-sm-12">
                <div className="row w-100">
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      marginRight: "5px",
                      backgroundColor: `${e.color}`,
                    }}
                  />
                  {t(e.shortDesc)} - {t(e.label)}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export const ScheduleTable = withTranslation()(ScheduleTableClass);
