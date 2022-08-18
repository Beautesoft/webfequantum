import React, { Component } from "react";
import { Routes } from "routes";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getMultiLanguage } from "redux/actions/multiLanguage";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class MultiLanguageClass extends Component {
  state = {
    isLanguageReady: false,
  };

  componentDidMount() {
    if (localStorage.getItem("translations") == null) {
      this.getData();
    } else {
      this.getData();
      this.init();
    }
  }

  getData = async () => {
    let res = await this.props.getMultiLanguage();
    console.log(res, "translations");
    let resources = { en: { translation: {} }, zh_sg: { translation: {} } };
    resources.en.translation = res.language.ENGLISH.reduce((a, e) => {
      return { ...a, [e.word]: e.word };
    }, {});
    resources.zh_sg.translation = res.language.CHINESE.reduce((a, e) => {
      return {
        ...a,
        [res.language.ENGLISH.find(e2 => e2.wordCode == e.wordCode).word]:
          e.word,
      };
    }, {});
    console.log(resources, "lang obj");
    localStorage.setItem("translations", JSON.stringify(resources));
    this.init();
  };

  init = () => {
    i18n
      .use(initReactI18next) // passes i18n down to react-i18next
      .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: JSON.parse(localStorage.getItem("translations")),
        lng: localStorage.getItem("lang") ?? "en", // if you're using a language detector, do not define the lng option
        fallbackLng: "en",
      });
    this.setState({ isLanguageReady: true });
  };

  render() {
    let { isLanguageReady } = this.state;
    return isLanguageReady ? <Routes /> : <div></div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getMultiLanguage,
    },
    dispatch
  );
};

export const MultiLanguage = connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiLanguageClass);
