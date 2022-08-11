import React, { Component } from "react";
import SignaturePad from "react-signature-canvas";
import { withTranslation } from "react-i18next";
import { NormalButton } from "../NormalButton";

export class SignPanelClass extends Component {
  state = { trimmedDataURL: null };
  sigPad = {};
  clear = () => {
    this.sigPad.clear();
  };
  trim = () => {
    this.setState({
      trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
    });
    setTimeout(() => {
      this.props.handleSignSaveClick(this.state.trimmedDataURL);
    }, 500);
  };

  render() {
    return (
      <div className={`container`}>
        <div className={`border`}>
          <SignaturePad
            canvasProps={{ className: `sigPad`, width: 200, height: 150 }}
            ref={ref => {
              this.sigPad = ref;
            }}
          />
        </div>
        <div className="d-flex">
          <div className="col-md-6">
            <NormalButton
              className={`pt-2`}
              onClick={this.clear}
              label="Clear"
              resetbg={true}
            />
          </div>
          <div className="col-md-6">
            <NormalButton
              className={`pt-2`}
              submitBtn={true}
              onClick={this.trim}
              label="Save"
            />
          </div>
        </div>
      </div>
    );
  }
}

export const SignPanel = withTranslation()(SignPanelClass);
