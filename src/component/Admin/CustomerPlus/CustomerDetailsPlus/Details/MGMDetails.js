import React, { Component } from "react";
import Tree from "react-animated-tree";
import { withTranslation } from "react-i18next";

export class MGMDetailsClass extends Component {
  componentDidMount() {
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }
  }

  render() {
    const treeStyles = {
      top: 40,
      left: 40,
      color: "black",
      fill: "black",
      width: "100%",
    };
    let { t } = this.props;
    return (
      <div className="container">
        <div className="row pb-5">
          <Tree content={t("Customer 1")} open style={treeStyles}>
            <Tree content={t("Customer 2")} />
            <Tree content={t("Customer 3")}>
              <Tree content={t("Customer 4")} />
              <Tree content={t("Customer 5")}>
                <Tree content={t("Customer 6")} />
                <Tree content={t("Customer 7")} />
                <Tree content={t("Customer 8")} />
              </Tree>
              <Tree content={t("Customer 9")} />
            </Tree>
            <Tree content={t("Customer 10")} />
            <Tree content={t("Customer 11")} />
          </Tree>
        </div>
      </div>
    );
  }
}

export const MGMDetails = withTranslation()(MGMDetailsClass);
