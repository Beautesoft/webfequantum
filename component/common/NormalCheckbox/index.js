import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class NormalCheckboxClass extends Component {
  render() {
    let {
      className = "custom-checkbox d-flex align-items-center",
      label = "",
      value = "",
      name = "",
      onChange,
      checked,
      inputClass = "",
      disabled = false,
      icon = true,
      t,
    } = this.props;

    return (
      <label className={className}>
        <input
          disabled={disabled}
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          className={inputClass}
          onChange={({ target: { name, checked: Checked } }) => {
            onChange && onChange({ target: { name, value: Checked } });
          }}
        />
        {icon ? (
          <span className="checkbox-tick d-flex justify-content-center align-items-center">
            <i className="icon-tick fs-10"></i>
          </span>
        ) : (
          ""
        )}
        {label ? <span className="label-txt fs-14 pl-1">{t(label)}</span> : ""}
      </label>
    );
  }
}

export const NormalCheckbox = withTranslation()(NormalCheckboxClass);
