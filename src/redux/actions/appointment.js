import {
  AuthActionType,
  AppointmentActionType,
} from "redux/actions/actionType";
import { addQuery } from "service/helperFunctions";
import { appointment } from "../../service/apiVariables";

// create appointment postmethod
export const CreateAppointment =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...appointment.addAppointment, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 201 || status === 200) {
            dispatch({
              type: AppointmentActionType.appointmentDetail,
              payload: data,
            });
            ////  Toast({ type: 'success', message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// create treatment post method
export const CreateTreatment =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...appointment.addTreatment, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: AppointmentActionType.getTreatmentDetail,
              payload: data,
            });
            ////  Toast({ type: 'success', message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// create Booking post method
export const createBooking =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.addBooking.addQuery = { key: "id", payload: id };
      api({ ...appointment.addBooking, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: AppointmentActionType.appointmentDetail, payload: data });
            ////  Toast({ type: 'success', message });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// cart update method
export const UpdateCart =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.updateTreatment.addQuery = { key: "id", payload: id };
      api({ ...appointment.updateTreatment, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: AppointmentActionType.appointmentDetail, payload: data });
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

// cart hold action
export const HoldCart =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.holdTreatment.addQuery = { key: "id", payload: id };
      api({ ...appointment.holdTreatment, body })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: AppointmentActionType.appointmentDetail, payload: data });
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

// cart delete action
export const DeleteCart =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.deleteTreatment.addQuery = { key: "id", payload: id };
      api({ ...appointment.deleteTreatment })
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

// get method for treatment action
export const getTreatment =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getTreatment.addQuery = { key: "id", payload: id };
      api({ ...appointment.getTreatment })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
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

// get method treatment detail list
export const getTreatmentDetailList =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getTreatmentDetailList.addQuery = { key: "id", payload: id };
      api({ ...appointment.getTreatmentDetailList })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            // dispatch({ type: CustomerActionType.getCustomerDetail, payload: data });
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

// get method Treatment detail
export const getTreatmentDetail =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getTreatmentDetail.addQuery = { key: "id", payload: id };
      api({ ...appointment.getTreatmentDetail })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: AppointmentActionType.getTreatmentDetail,
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

// get outlet
export const getOutletDetail =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getOutletDetail.addQuery = { key: "id", payload: id };
      api({ ...appointment.getOutletDetail })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: AppointmentActionType.getOutletDetail,
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

// selected treatment get method
export const getSelectedTreatmentList =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getOutletDetail.addQuery = { key: "id", payload: id };
      api({ ...appointment.getOutletDetail })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: AppointmentActionType.getSelectedTreatmentList,
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

// appointment get method
export const getAppointmentList =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getAppointment.addQuery = { key: "id", payload: id };
      api({ ...appointment.getAppointment })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: AppointmentActionType.getConfirmedBookingList,
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

// booked appointment list get method
export const getBookAppointmentList =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getOutletDetail.addQuery = { key: "id", payload: id };
      api({ ...appointment.getOutletDetail })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: AppointmentActionType.getBookAppointmentList,
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

// appointment cart list get method
export const getAppointmentCartList =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      appointment.getCartList.addQuery = { key: "id", payload: id };
      api({ ...appointment.getCartList })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: AppointmentActionType.getAppointmentCartList,
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

// store data action for form field
export function updateForm(type, data) {
  return {
    type: type,
    payload: data,
  };
}
