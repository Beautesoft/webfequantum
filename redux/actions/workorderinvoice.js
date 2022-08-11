import { WorkOrderInvoiceActionType } from "redux/actions/actionType";
import { workorderinvoice } from "../../service/apiVariables";

export const updateWorkorderinvoice =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      workorderinvoice.updateWorkorderinvoice.addQuery = {
        key: "id",
        payload: id,
      };
      api({ ...workorderinvoice.updateWorkorderinvoice, body })
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

export const createWorkorderinvoice =
  body =>
  (dispatch, getState, { api, Toast }) => {
    console.log("inside createWorkorderinvoice inside action file",{ ...workorderinvoice.addworkorderinvoice })

    return new Promise((resolve, reject) => {
      api({ ...workorderinvoice.addworkorderinvoice, body })
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

// get customer action
export const getWorkorderinvoice =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      workorderinvoice.getworkorderinvoice.addQuery = {
        key: "id",
        payload: id,
      };

      api({ ...workorderinvoice.getworkorderinvoice })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: WorkOrderInvoiceActionType.getProjectListing,
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

export const deleteWorkorderinvoice =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      workorderinvoice.deleteworkorderinvoice.addQuery = {
        key: "id",
        payload: id,
      };
      api({ ...workorderinvoice.deleteworkorderinvoice, body })
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
