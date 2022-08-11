import { CustomerActionType, CommonActionType } from "redux/actions/actionType";
import { authApi } from "service/apiVariables";
import { addQuery } from "service/helperFunctions";
import { history } from "../../helpers";
import {
  Salon,
  Staff,
  customer,
  Services,
  Products,
} from "../../service/apiVariables";
import { api } from "../../service/api";
import { Toast } from "../../service/toast";
import { NotificationManager } from "react-notifications";

// create customer action
export const CreateCustomer =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...customer.addCustomer, body })
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

// update customer action
export const updateCustomer =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customer.updateCustomer.addQuery = { key: "id", payload: id };
      api({ ...customer.updateCustomer, body })
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

// get customer action
export const getCustomer =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      customer.getCustomer.addQuery = { key: "id", payload: id };

      api({ ...customer.getCustomer })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: CustomerActionType.getCustomerDetail,
              payload: data,
            });
            // //  Toast({ type: 'success', message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const CreateHoldItem =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...customer.addHoldItem, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
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
