import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class NormalInputClass extends Component {
  render() {
    let {
      className = "form-control",
      placeholder = "",
      onChange,
      value = "",
      name,
      disabled = false,
      type = "text",
      iconname = "",
      onClick,
      onDoubleClick,
      onFocus = () => {},
      onBlur = () => {},
      t,
    } = this.props;

    return (
      <>
        {iconname !== "" ? (
          <span className={`${iconname} input-icon`}></span>
        ) : (
          ""
        )}
        <input
          className={`${className} ${iconname !== "" ? "pl-5" : ""}`}
          name={name}
          type={type}
          disabled={disabled}
          value={value}
          min={0}
          placeholder={t(placeholder)}
          autoComplete="off"
          onFocus={onFocus}
          onBlur={onBlur}
          onClick={onClick ? onClick : () => {}}
          onDoubleClick={onDoubleClick ? onDoubleClick : () => {}}
          onChange={e => {
            console.log(e);
            let body = {};

            body = {
              target: {
                name: e.target.name,
                value: e.target.value,
              },
            };

            onChange(body);
          }}
        />
      </>
    );
  }
}

export const NormalInput = withTranslation()(NormalInputClass);
