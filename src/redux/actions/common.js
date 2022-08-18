import { CommonActionType } from "redux/actions/actionType";
import { common } from "service/apiVariables";
import { history } from "../../helpers";
import { Toast } from "../../service/toast";

// common branch create method
export const createBranch =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...common.addBranch, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            //Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// common branch update method
export const updateBranch =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.updateBranch.addQuery = { key: "id", payload: id };
      api({ ...common.updateBranch, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            //Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// common get branch
export const getBranch =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.getBranch.addQuery = { key: "id", payload: id };
      api({ ...common.getBranch })
        .then(response => {
          resolve(response);
          let { message, data, status } = response;
          if (status === 200 || status === 201) {
            dispatch({ type: CommonActionType.getBranchList, payload: data });
            // Toast({ type: 'success', message })
          } else {
            // reject(Toast({ type: 'error', message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// common jobtitle get method
export const getJobtitle =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...common.getJobtitle })
        .then(response => {
          resolve(response);
          let { message, data, status } = response;
          if (status === 200 || status === 201) {
            dispatch({ type: CommonActionType.getJobtitleList, payload: data });
            // Toast({ type: 'success', message })
          } else {
            // reject(Toast({ type: 'error', message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// common get shift method
export const getShift =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.getShift.addQuery = { key: "id", payload: id };
      api({ ...common.getShift })
        .then(response => {
          resolve(response);
          let { message, data, status } = response;
          if (status === 200 || status === 201) {
            dispatch({ type: CommonActionType.getShiftList, payload: data });
            // Toast({ type: 'success', message })
          } else {
            // reject(Toast({ type: 'error', message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// common get category method
export const getCategory =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...common.getCategory })
        .then(response => {
          resolve(response);
          let { message, data, status } = response;
          if (status === 200 || status === 201) {
            dispatch({ type: CommonActionType.getCategoryList, payload: data });
            // Toast({ type: 'success', message })
          } else {
            // reject(Toast({ type: 'error', message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// get common skills method
export const getSkills =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...common.getSkills })
        .then(response => {
          resolve(response);
          let { message, data, status } = response;
          if (status === 200 || status === 201) {
            dispatch({ type: CommonActionType.getSkillsList, payload: data });
            // Toast({ type: 'success', message })
          } else {
            // reject(Toast({ type: 'error', message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// common get customer method
export const getCustomer =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...common.getCustomer })
        .then(response => {
          resolve(response);
          let { message, data, status } = response;
          if (status === 200 || status === 201) {
            dispatch({ type: CommonActionType.getCustomerList, payload: data });
            // Toast({ type: 'success', message })
          } else {
            // reject(Toast({ type: 'error', message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// universal get method
export const getCommonApi =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.getCommon.addQuery = { key: "id", payload: id };
      api({ ...common.getCommon })
        .then(response => {
          resolve(response);
          let { message, data, status } = response;
          // if (status === 200 || status === 201) {
          //   Toast({ type: 'success', message })
          // } else {
          //   reject(Toast({ type: 'error', message }));
          // }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// universal post method
export const commonCreateApi =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.addCommon.addQuery = { key: "id", payload: id };
      api({ ...common.addCommon, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          console.log(response, "commoncreateapiresponse");
          if (status === 200 || status === 201) {
            // Toast({ type: 'success', message })
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// universal update method
export const commonUpdateApi =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.updateCommon.addQuery = { key: "id", payload: id };
      api({ ...common.updateCommon, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            //    Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// universal update method
export const commonPatchApi =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.commonPatch.addQuery = { key: "id", payload: id };
      api({ ...common.commonPatch, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            //Toast({ type: 'success', message })
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// universal delete method
export const commonDeleteApi =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      common.deleteCommon.addQuery = { key: "id", payload: id };
      api({ ...common.deleteCommon, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201 || status === 204) {
            // Toast({ type: 'success', message })
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// store data action for form field
export function updateForm(type, data) {
  return {
    type: type,
    payload: data,
  };
}
