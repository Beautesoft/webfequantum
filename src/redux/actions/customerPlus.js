import { CustomerPlusActionType } from "redux/actions/actionType";
import { customerPlus, lpManagement } from "../../service/apiVariables";

// create customer action
export const CreateCustomerPlus =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...customerPlus.addCustomerPlus,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            // Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// update customer action
export const updateCustomerPlus =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customerPlus.updateCustomerPlus.addQuery = { key: "id", payload: id };
      api({
        ...customerPlus.updateCustomerPlus,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            // Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// get customer action
export const getCustomerPlus =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customerPlus.getCustomerPlus.addQuery = { key: "id", payload: id };

      api({ ...customerPlus.getCustomerPlus })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getCustomerPlusDetail,
              payload: data,
            });
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

// get customer MGM action
export const getCustomerMGMDetails =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customerPlus.getMGMdetails.addQuery = { key: "id", payload: id };
      api({ ...customerPlus.getMGMdetails })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getMGMDetails,
              payload: data,
            });
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

// get customer settings action
export const getCustomerPlusSettings =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      if (id)
        customerPlus.getCustomerPlusSettings.addQuery = {
          key: "id",
          payload: id,
        };

      api({ ...customerPlus.getCustomerPlusSettings })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getCustomerPlusSettings,
              payload: data,
            });
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

// update customer settings action
export const updateCustomerPlusSettings =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...customerPlus.updateCustomerPlusSettings,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            //  Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

//get customer points
export const getCustomerPoints =
  (id, params) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      lpManagement.getCustomerPoints.addQuery = { key: "id", payload: id };
      lpManagement.getCustomerPoints.addQuery = {
        key: "params",
        payload: params,
      };
      api({
        ...lpManagement.getCustomerPoints,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getCustomerPoints,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// add manual lp management
export const AddManualLoyaltyPoints =
  (id, params, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      lpManagement.addManualPoints.addQuery = { key: "id", payload: id };
      lpManagement.addManualPoints.addQuery = {
        key: "params",
        payload: params,
      };
      api({
        ...lpManagement.addManualPoints,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            // Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

//get lpmanagement reward settings
export const getRewardPlolicySettings =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      lpManagement.getRewardPolicy.addQuery = { key: "id", payload: id };
      api({
        ...lpManagement.getRewardPolicy,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getRewardPolicySettings,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

//add lpmanagement reward settings
export const addRewardPlolicySettings =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...lpManagement.addRewardPolicy,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            //  Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

//edit lpmanagement reward settings
export const updateRewardPlolicySettings =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      lpManagement.updateRewardPolicy.addQuery = { key: "id", payload: id };
      api({
        ...lpManagement.updateRewardPolicy,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

//get lpmanagement redeem settings
export const getRedeemPlolicySettings =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      lpManagement.getRedeemPolicy.addQuery = { key: "id", payload: id };
      api({
        ...lpManagement.getRedeemPolicy,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getRedeemPolicySettings,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

//add lpmanagement redeem settings
export const addRedeemPlolicySettings =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...lpManagement.addRedeemPolicy,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

//edit lpmanagement redeem settings
export const updateRedeemPlolicySettings =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      lpManagement.updateRedeemPolicy.addQuery = { key: "id", payload: id };
      api({
        ...lpManagement.updateRedeemPolicy,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// get diagnosis photo list
export const getDiagnosisPhotos =
  (id, params) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customerPlus.getDiagnosisPhotos.addQuery = { key: "id", payload: id };
      customerPlus.getDiagnosisPhotos.addQuery = {
        key: "params",
        payload: params,
      };
      api({ ...customerPlus.getDiagnosisPhotos })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getDiagnosisPhotos,
              payload: data,
            });
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

// add dignosis photo
export const addDiagosisPhoto =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...customerPlus.addDiagnosisPhoto,
        body,
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            //  Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// update dignosis photo
export const updateDiagosisPhoto =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customerPlus.updateDiagnosisPhoto.addQuery = { key: "id", payload: id };
      api({
        ...customerPlus.updateDiagnosisPhoto,
        body,
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            // Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// get diagnosis history
export const getDiagnosisHistory =
  (id, params) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customerPlus.getDiagnosisHistory.addQuery = { key: "id", payload: id };
      customerPlus.getDiagnosisHistory.addQuery = {
        key: "params",
        payload: params,
      };
      api({ ...customerPlus.getDiagnosisHistory })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerPlusActionType.getDiagnosisHistory,
              payload: data,
            });
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

// add dignosis history
export const addDiagnosisHistory =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...customerPlus.addDiagnosisHistory,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            //   Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// update dignosis history
export const updateDiagnosisHistory =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customerPlus.updateDiagnosisHistory.addQuery = { key: "id", payload: id };
      api({
        ...customerPlus.updateDiagnosisHistory,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            //  Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };


  // get customer project list history
export const getCustomerProjectList =
(id, params) =>
(dispatch, getState, { api, Toast }) => {
  console.log("ACtion Started")
  return new Promise((resolve, reject) => {
    customerPlus.customerProjectList.addQuery = { key: "cust_id", payload: id };
  
    api({ ...customerPlus.customerProjectList })
      .then(response => {
        resolve(response);
        let { message, status, data } = response;
        if (status === 200 || status === 201) {
          console.log(data,"I am Action OF ")
          dispatch({
            type: CustomerPlusActionType.getCustomerProjectList,
            payload: data,
          });
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