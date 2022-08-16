import React, { Component } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import { withTranslation } from "react-i18next";

class NormalRadioClass extends Component {
  render() {
    let {
      className = "form-control",
      label = "",
      onChange,
      value = "",
      name,
      disabled = false,
      type = "text",
      iconname = "",
      onClick,
      t,
    } = this.props;

    return (
      <>
        {/* {iconname !== "" ? (
          <span className={`${iconname} input-icon`}></span>
        ) : (
            ""
          )} */}
        <FormGroup className={className} check={value}>
          <Label check={value}>
            <Input type="radio" name={name} /> {t(label)}
          </Label>
        </FormGroup>
      </>
    );
  }
}

export const NormalRadio = withTranslation()(NormalRadioClass);
