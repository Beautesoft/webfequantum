import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class NormalSelectClass extends Component {
  render() {
    let {
      className = "",
      options = [],
      keyName = "label",
      valueName = "value",
      onChange,
      value = "",
      name = "",
      placeholder = "Select",
      isPlaceholderNeed = true,
      disabled = false,
      iconname = "icon-down-arrow",
      t,
      buttonClass,
    } = this.props;

    return (
      <>
        {/* {iconname !== "" ? (
                    <span className={`${iconname} input-icon`}></span>
                ) : (
                        ""
                    )} */}
        <div className={`position-relative w-100 select ${buttonClass}`}>
          <select
            className={`${className} form-control select-form-control px-3`}
            value={value}
            disabled={disabled}
            onChange={e => {
              let body = {
                target: {
                  name: e.target.name,
                  value: e.target.value, // === "" ? e.target.value : Number(e.target.value)
                },
              };
              onChange(body);
            }}
            name={name}
          >
            {isPlaceholderNeed ? (
              <option value="">{t(placeholder)}</option>
            ) : (
              ""
            )}
            {options.map((option, index) => (
              <option
                value={option[valueName]}
                key={index}
                style={{
                  backgroundColor: `${
                    option["color"] ? option["color"] : "unset"
                  }`,
                }}
              >
                {option[keyName]}
              </option>
            ))}
            <span
              className={`${iconname} select-icon`}
              id="small-down-arrow"
            ></span>
          </select>
        </div>
      </>
    );
  }
}

export const NormalSelect = withTranslation()(NormalSelectClass);
