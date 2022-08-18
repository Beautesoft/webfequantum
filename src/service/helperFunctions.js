import { history } from "helpers";

export const addQuery = (dataObject, apiObject) => {
  if (!dataObject) {
    return "";
  }

  let keys = ["page", "limit", "search", "token", "sortOut", "status"];

  keys.map(key => {
    if (dataObject.hasOwnProperty(key) && typeof dataObject[key] != "object") {
      if (apiObject.query.hasOwnProperty(key)) {
        apiObject.addQuery = { key, payload: dataObject[key] };
      }
    } else {
      dataObject[key] &&
        Object.keys(dataObject[key]).map(keyName => {
          if (apiObject.query.hasOwnProperty(keyName)) {
            apiObject.addQuery = {
              key: keyName,
              payload: dataObject[key][keyName],
            };
          }
        });
    }
  });
};

export const generateQuery = query => {
  let url = "";

  if (query.hasOwnProperty("url_id")) {
    url = `/${query.url_id}`;
  }

  return (
    url +
    Object.keys(query).reduce((accumulator, key, index, array) => {
      if (
        query[key] == "" ||
        query[key] == null ||
        key == "url_id" ||
        (query[key] !== null && query[key].toString().trim() == "")
      ) {
        return accumulator;
      } else {
        return accumulator + `${index != 0 ? "&" : "?"}${key}=${query[key]}`;
      }
    }, "")
  );
};

export const getSNo = ({ totalPages, page = 1, chunk }, index) => {
  return parseInt((page - 1) * chunk) + index + 1;
};

export const appendQuery = data => {
  history.push({
    search: generateURLQuery(history.location.search, data),
  });
};

export const generateURLQuery = (url, data) => {
  return data.reduce((acc, { label, value }) => {
    if (dataRequiredValidation(value)) {
      return updateQueryStringParameter(acc, label, value);
    } else {
      return removeQueryStringParameter(acc, label);
    }
  }, url);
};

export const scrollTop = (id = "content-page", selector = "getElementById") => {
  var contentPageEle = document[selector](id);

  if (selector !== "getElementById") {
    contentPageEle = contentPageEle[0];
  }

  contentPageEle &&
    contentPageEle.scrollTo &&
    contentPageEle.scrollTo({
      top: 0,
      behavior: "smooth",
    });
};

export const getUrlParameter = name => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  var results = regex.exec(window.location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

export const displayImg = file => {
  if (typeof file === "object") {
    return URL.createObjectURL(file);
  } else {
    return file;
  }
};

const dataRequiredValidation = value =>
  value !== "" && value !== null && value !== undefined;

const updateQueryStringParameter = (uri, key, value) => {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
};

const removeQueryStringParameter = (url, parameter) => {
  var urlparts = url.split("?");
  if (urlparts.length >= 2) {
    var prefix = encodeURIComponent(parameter) + "=";
    var pars = urlparts[1].split(/[&;]/g);

    for (var i = pars.length; i-- > 0; ) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }
    return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
  }
  return url;
};

export const replaceQuery = data => {
  history.replace({
    search: generateURLQuery(history.location.search, data),
  });
};

export const convertStringToObject = searchQuery => {
  try {
    if (!!searchQuery) {
      var search = searchQuery.substring(1);

      let obj = JSON.parse(
        '{"' +
          decodeURI(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"') +
          '"}'
      );

      return {
        filter: "",
        search: "",
        page: 1,
        field: "",
        orderBy: "",
        ...obj,
      };
    }

    return {
      search: "",
      page: 1,
      field: "",
      orderBy: "",
      filter: "",
    };
  } catch (error) {
    console.log(error, "d4sds4d");
  }
};

export const dateFormat = (data, format) => {
  let date = new Date(data);
  let d = date.getDate();
  let day = d < 10 ? "0" + d : d;
  let a = date.getMonth() + 1;
  let month = a < 10 ? "0" + a : a;
  let year = date.getFullYear();
  if (format === "dd-mm-yyyy") {
    return day + "-" + month + "-" + year;
  } else if (format === "yyyy-mm-dd") {
    return year + "-" + month + "-" + day;
  } else if (format === "yyyy/mm/dd") {
    return year + "/" + month + "/" + day;
  } else {
    return year + "-" + month + "-" + day;
  }
};
