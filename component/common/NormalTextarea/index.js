import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class NormalTextareaClass extends Component {
  render() {
    let {
      className = "form-control",
      placeholder = "",
      onChange,
      value = "",
      name,
      disabled = false,
      type = "text",
      t,
      rows
    } = this.props;

    return (
      <>
        <textarea          
          rows={rows}
          className={className}
          name={name}
          disabled={disabled}
          value={value}
          placeholder={t(placeholder)}
          onChange={(e) => {
            let body = {};

            body = {
              target: {
                name: e.target.name,
                value: e.target.value,
              },
            };

            onChange(body);
          }}
        ></textarea>
      </>
    );
  }
}

export const NormalTextarea = withTranslation()(NormalTextareaClass);
