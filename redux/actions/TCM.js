import { Tcm } from "service/apiVariables";

export const getTcmApi =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      Tcm.getTcm.addQuery = { key: "id", payload: id };
      api({ ...Tcm.getTcm })
        .then(response => {
          resolve(response);
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
export const tcmCreateApi =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      Tcm.postTCM.addQuery = { key: "id", payload: id };
      api({ ...Tcm.postTCM, body })
        .then(response => {
          resolve(response);
          // let message = "success";
          // let { error, success } = response;
          // if (success === "1") {
          //   //  Toast({ type: 'success', message });
          // } else {
          //   reject(Toast({ type: "error", error }));
          // }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// universal update method
export const tcmUpdateApi =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      Tcm.updateTCM.addQuery = { key: "id", payload: id };
      api({ ...Tcm.updateTCM, body })
        .then(response => {
          resolve(response);
          let { message, status, success } = response;
          if (success === "1") {
            //  Toast({ type: 'success', message });
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
export const tcmPatchApi =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      Tcm.patchTcm.addQuery = { key: "id", payload: id };
      api({ ...Tcm.patchTcm, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            //  Toast({ type: 'success', message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
