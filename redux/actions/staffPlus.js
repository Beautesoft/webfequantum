import { StaffPlusActionType } from "redux/actions/actionType";
import { staffPlus } from "service/apiVariables";

// create staffplus action
export const createStaffPlus =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...staffPlus.addStaff, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: StaffActionType.getStaffDetail, payload: data });
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

// get workschedule action
export const getWorkSchedule =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.getWorkSchedule.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.getWorkSchedule })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getStaffPlusWorkSchedule,
              payload: data,
            });
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

// update workschedule action
export const updateWorkSchedule =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.updateWorkSchedule.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.updateWorkSchedule, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
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

// update staffplus action
export const updateStaffPlus =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.updateStaff.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.updateStaff, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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

// update staffplus action
export const updateEmpInfo =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.updateEmpInfo.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.updateEmpInfo, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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

// get staffplus  action
export const getStaffPlus =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.getStaffPlus.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.getStaffPlus })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getStaffPlusDetail,
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

// get skilllist  action
export const getSkillList =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.getSkillList.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.getSkillList })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getStaffPlusSkillList,
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

// update emp skilllist action
export const updateEmpSkillList =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.updateEmpSkillList.addQuery = { key: "id", payload: id };
      api({
        ...staffPlus.updateEmpSkillList,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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

// get emp skilllist  action
export const getEmpSkillList =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.getEmpSkillList.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.getEmpSkillList })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getEmpEmpSkillList,
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

// get staffplus schedule  action
export const getStaffSchedule =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.getSchedule.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.getSchedule })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getStaffPlusSchedule,
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

//update staffplus schedule action
export const updateStaffPlusSchedule =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...staffPlus.updateSchedule,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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

// get staffplus schedule  action
export const getAllEmpSchedule =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.getAllEmpSchedule.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.getAllEmpSchedule })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getStaffPlusAllEmpSchedule,
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

// delete staff action
export const deleteStaffPlus =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.deleteStaff.addQuery = { key: "id", payload: id };
      api({ ...staffPlus.deleteStaff, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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

// get staffplus authorization  action
export const getAuthorizationSettings =
  () =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...staffPlus.getSecurityAuthorizationSettings })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getAuthorizationSettings,
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

//update staffplus authorization settings action
export const updateAuthorizationSettings =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({
        ...staffPlus.updateSecurityAuthorizationSettings,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
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

// get staffplus authorization  action
export const getIndividualAuthorizationSettings =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.getIndividualAuthorizationSettings.addQuery = {
        key: "id",
        payload: id,
      };
      api({ ...staffPlus.getIndividualAuthorizationSettings })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: StaffPlusActionType.getIndividualAuthorizationSettings,
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

//update staffplus authorization settings action
export const updateIndividualAuthorizationSettings =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staffPlus.updateIndividualAuthorizationSettings.addQuery = {
        key: "id",
        payload: id,
      };
      api({
        ...staffPlus.updateIndividualAuthorizationSettings,
        body,
        header: { type: "Content-Type", value: "application/json" },
      })
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
