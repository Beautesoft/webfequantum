import { PaymentActionType } from "redux/actions/actionType";
import { payment } from "../../service/apiVariables";

// create payment action
export const createPayment =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      payment.addPayment.addQuery = { key: "id", payload: id };
      api({ ...payment.addPayment, body })
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

// update payment action
export const updatePayment =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      payment.updatePayment.addQuery = { key: "id", payload: id };
      api({ ...payment.updatePayment, body })
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

// delete payment action
export const deletePayment =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      payment.deletePayment.addQuery = { key: "id", payload: id };
      api({ ...payment.deletePayment, body })
        .then(response => {
          resolve(response);
          let { message, status } = response;
          console.log("sadfadfgadfgdf", response);
          if (status === 200 || status === 201) {
            // dispatch({ type: ArticalsActionType.getArticalsDetails, payload: data });
            //Toast({ type: "success", message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(error => {
          console.log("sadfadfgadfgdf errorr", error);
          reject(error);
          let { message } = error;
          Toast({ type: "error", message });
        });
    });
  };

// get payment action
export const getPayment =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      payment.getPayment.addQuery = { key: "id", payload: id };
      api({ ...payment.getPayment })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: PaymentActionType.getPaymentDetail,
              payload: data,
            });
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
