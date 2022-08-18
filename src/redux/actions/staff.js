import { StaffActionType } from "redux/actions/actionType";
import { staff } from "service/apiVariables";

// create staff action
export const createStaff =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...staff.addStaff, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: StaffActionType.getStaffDetail, payload: data });
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

// update staff action
export const updateStaff =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staff.updateStaff.addQuery = { key: "id", payload: id };
      api({ ...staff.updateStaff, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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
export const deleteStaff =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staff.deleteStaff.addQuery = { key: "id", payload: id };
      api({ ...staff.deleteStaff, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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

// get staff  action
export const getStaff =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staff.getStaff.addQuery = { key: "id", payload: id };
      api({ ...staff.getStaff })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({ type: StaffActionType.getStaffDetail, payload: data });
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

// get staff availability action
export const getStaffAvailability =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staff.getStaffAvailability.addQuery = { key: "id", payload: id };
      api({ ...staff.getStaffAvailability })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: StaffActionType.getStaffDetail, payload: data });
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

// get staff branchwise action
export const getStaffBranchwise =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      staff.getStaffBranchwise.addQuery = { key: "id", payload: id };
      api({ ...staff.getStaffBranchwise })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: StaffActionType.getStaffDetail, payload: data });
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
