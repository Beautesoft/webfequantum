import { QuotationActionType } from "redux/actions/actionType";
import { quotation } from "../../service/apiVariables";

export const updateQuotation =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      quotation.updateQuotation.addQuery = { key: "id", payload: id };
      api({ ...quotation.updateQuotation, body })
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

export const createQuotation =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...quotation.addQuotation, body })
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

  export const removePaymentSchedule =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      quotation.removePaymentSchedule.addQuery = { key: "id", payload: id };
      api({ ...quotation.removePaymentSchedule, body })
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
  export const addPaymentSchedule =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...quotation.addPaymentSchedule, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

  export const removeManualPaymentSchedule =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      quotation.removeManualPaymentSchedule.addQuery = { key: "id", payload: id };
      api({ ...quotation.removeManualPaymentSchedule, body })
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
  export const addManualPaymentSchedule =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...quotation.addManualPaymentSchedule, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
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
export const getQuotation =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      quotation.getQuotation.addQuery = { key: "id", payload: id };

      api({ ...quotation.getQuotation })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: QuotationActionType.getQuotationListing,
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

export const deleteQuotation =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      quotation.deleteQuotation.addQuery = { key: "id", payload: id };
      api({ ...quotation.deleteQuotation, body })
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
