import { DeliveryOrderActionType } from "redux/actions/actionType";
import { deliveryorder } from "../../service/apiVariables";

export const updatedeliveryorder =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      deliveryorder.updatedeliveryorderinvoice.addQuery = {
        key: "id",
        payload: id,
      };
      api({ ...deliveryorder.updatedeliveryorderinvoice, body })
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

export const createdeliveryorder =
  body =>
  (dispatch, getState, { api, Toast }) => {
      console.log("inside createdeliveryorder inside action file",{ ...deliveryorder.adddeliveryorder })
    return new Promise((resolve, reject) => {
      api({ ...deliveryorder.adddeliveryorderinvoice, body })
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
export const getdeliveryorder =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      deliveryorder.getdeliveryorderinvoice.addQuery = {
        key: "id",
        payload: id,
      };

      api({ ...deliveryorder.getdeliveryorderinvoice })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: DeliveryOrderActionType.getProjectListing,
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

export const deletedeliveryorder =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      deliveryorder.deletedeliveryorderinvoice.addQuery = {
        key: "id",
        payload: id,
      };
      api({ ...deliveryorder.deletedeliveryorderinvoice, body })
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
