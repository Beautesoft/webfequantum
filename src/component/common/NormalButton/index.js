import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class NormalButtonClass extends Component {
  render() {
    const {
      className = "",
      label = "",
      onClick,
      id,
      disabled = false,
      outline = false,
      mainbg = false,
      link = false,
      normal = false,
      success = false,
      danger = false,
      mainbgrev = false,
      applybg = false,
      resetbg = false,
      styleOne = false,
      styleTwo = false,
      styleThree = false,
      styleFour = false,
      styleFive = false,
      submitBtn = false,
      rightIcon = "",
      leftIcon = "",
      buttonClass = "",
      t,
    } = this.props;

    return (
      <div className={`${buttonClass}`}>
        <button
          id={id}
          className={`btn cursor-pointer ${outline ? "outline-btn" : ""} ${
            danger ? "danger-btn" : ""
          } ${mainbg ? "mainbg-btn" : ""} ${normal ? "normal-btn" : ""} ${
            link ? "delete-btn" : ""
          } ${success ? "success-btn" : ""} ${
            mainbgrev ? "mainbgreverse-btn" : ""
          } 
          ${applybg ? "applybgreverse-btn" : ""}
          ${resetbg ? "resetbgreverse-btn" : ""} 
          ${styleOne ? "styleOne-btn" : ""} 
          ${styleTwo ? "styleTwo-btn" : ""} 
          ${styleThree ? "styleThree-btn" : ""} 
          ${styleFour ? "styleFour-btn" : ""} 
          ${styleFive ? "styleFive-btn" : ""} 
          ${submitBtn ? "submit-btn" : ""}

          ${className}`}
          onClick={onClick}
          disabled={disabled}
        >
          {leftIcon !== "" ? (
            <img src={leftIcon} width="25" alt="s" className="p-1" />
          ) : (
            ""
          )}
          {t(label)}
          {rightIcon !== "" ? (
            <span className={`btn-right-icon ${rightIcon} p-1`}></span>
          ) : (
            ""
          )}
        </button>
      </div>
    );
  }
}

export const NormalButton = withTranslation()(NormalButtonClass);
