import helpers from "./Helper";
import { axiosInstance, logout } from "./utilities";

export var api = async function ({
  method = "get",
  api,
  header,
  body,
  status = false,
  token = "",
  baseURL = "normal",
}) {
  return await new Promise((resolve, reject) => {
    // setting token
    // localStorage.getItem('AuthTypeId')
    //   ? (axiosInstance.defaults.headers.common['user-type'] = localStorage.getItem('AuthTypeId'))
    //   : '';
    // if (!!localStorage.getItem("AuthTypeId"))
    //   axiosInstance.defaults.headers.common["user-type"] = localStorage.getItem(
    //     "AuthTypeId"
    //   );
    if (!!localStorage.getItem("AuthToken"))
      axiosInstance.defaults.headers.common["Authorization"] =
        "token " + localStorage.getItem("AuthToken");

    axiosInstance.defaults.crossDomain = true;
    if (!!header) {
      axiosInstance.defaults.headers.put[header.type] = header.value;
      axiosInstance.defaults.headers.post[header.type] = header.value;
    }
    // axiosInstance.defaults.headers.common[
    //   'Accept'
    // ] = 'application/json';

    // axiosInstance.defaults.headers.common[
    //   'Content-Type'
    // ] = 'multipart/form-data';
    // axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';

    axiosInstance[method](`${getServiceUrl(baseURL)}${api}`, body ? body : "")
      .then((data) => {
        resolve(statusHelper(status, data));
      })
      .catch((error) => {
        try {
          if (error.response) {
            reject(statusHelper(status, error.response));
          } else {
            reject(error);
          }
        } catch (err) {
          console.log(err);
          reject(err);
        }
      });
  });
};

var statusHelper = (status, data) => {
  if (data.status === 401 || data.status === 403) {
    logout();
  }
  if (status) {
    return {
      status: data.status,
      ...data.data,
    };
  } else {
    return data.data;
  }
};

let getServiceUrl = (baseURL) => {
  let finalURL = "";
  switch (baseURL) {
    case "normal":
      finalURL = helpers.getUrl() + "api/"; //live
      // finalURL = "http://52.60.58.9:8000/api/";
      break;
    case "token":
      finalURL = helpers.getUrl() + "api/"; //live
      // finalURL = "http://52.60.58.9:8000/api/";
      break;
    case "commission":
      finalURL = helpers.getUrl() + "api/"; //live
      //finalURL = "http://103.253.15.184:8000/api/"; //live
      // finalURL = "http://52.60.58.9:8000/api/";
      break;
    case "backend":
      finalURL = helpers.getBEUr() + "api/";
      break;
    case "tcm":
      finalURL = helpers.getTCMUrl() + "api/";
      break;
    default:
      finalURL = helpers.getUrl() + "api/"; //live
    // finalURL = "http://52.60.58.9:8000/api/";
  }

  return finalURL;
};

export function getUrl() {
  return "test";
}
