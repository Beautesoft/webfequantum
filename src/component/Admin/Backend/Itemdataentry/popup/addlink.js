import React, { Component } from "react";
import { NormalButton, NormalInput } from "component/common";
import { withTranslation } from "react-i18next";
import { NewItemLinks, ItemLinks } from "redux/actions/Backend";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Toast } from "service/toast";

export default class NewlinkpopupClass extends Component {
  state = {
    linkcode: null,
    linkdesc: this.props.name,
  };
  handleinput = ({ target: { value, name } }) => {
    console.log(this.props.name);

    let { linkcode, linkdesc } = this.state;
    if (name == "linkcode") {
      linkcode = value;
      this.setState({ linkcode });
    }
    if (name == "linkdesc") {
      linkdesc = value;
      this.setState({ linkdesc });
    }
  };
  handlesubmit = async () => {
    let { linkcode, linkdesc, objIndex } = this.state;
    if (linkdesc == null || linkdesc == "") {
      Toast({
        type: "error",
        message: "Please check required field",
      });
    } else {
      await this.props.ItemLinks().then((res) => {
        objIndex = res.findIndex((obj) => obj.linkCode == linkcode);
      });
      if (objIndex == -1) {
        let newlist = {
          linkCode: linkcode,
          itemCode: this.props.id,
          linkDesc: linkdesc,
          linkFactor: 0,
          linkType: "",
          itmIsactive: true,
          rptCodeStatus: false,
        };
        await this.props
          .NewItemLinks(newlist)
          .then((data) => {
            this.props.handleModal();
            this.props.listoflinklist();
          })

          .catch((e) => console.log(e));
      } else {
        Toast({
          type: "error",
          message: "Please check code is already present",
        });
      }
    }
  };

  render() {
    let { linkcode, linkdesc } = this.state;
    console.log(this.props.id);
    return (
      <div>
        <h6>Add Link</h6>
        <div className="d-flex mt-3">
          <div className="col-6 mt-3">
            <p>Link Code</p>
            <NormalInput
              onChange={this.handleinput}
              value={linkcode}
              name="linkcode"
            />
          </div>
          <div className="col-6 mt-3">
            <span>Link Description</span>
            <span style={{ color: "red" }}>*</span>
            <NormalInput
              onChange={this.handleinput}
              value={linkdesc}
              name="linkdesc"
            />
          </div>
        </div>
        <div className="d-flex mt-3 justify-content-between">
          <div className="pl-2">
            <NormalButton
              mainbg={true}
              label={"Cancel"}
              onClick={() => this.props.handleModal()}
            />
          </div>
          <div className="pr-2">
            <NormalButton
              mainbg={true}
              label={"Submit"}
              onClick={() => this.handlesubmit()}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      NewItemLinks,
      ItemLinks,
    },
    dispatch
  );
};
export const Newlinkpopup = withTranslation()(
  connect(null, mapDispatchToProps)(NewlinkpopupClass)
);
