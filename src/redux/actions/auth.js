import { AuthActionType } from "redux/actions/actionType";
import { authApi } from "service/apiVariables";
import { addQuery } from "service/helperFunctions";
import { history } from "../../helpers";
import {
  saloon,
  staff,
  customer,
  services,
  Products,
} from "../../service/apiVariables";
import { api } from "../../service/api";
import { Toast } from "../../service/toast";
import { NotificationManager } from "react-notifications";

// login action
export const login =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...authApi.login, body })
        .then(response => {
          // console.log(message,Token,'123')
          resolve(response);
          let { status, data } = response;
          let { message, token } = data;
          if (status === 200 || status === 201) {
            localStorage.setItem("AuthToken", token);
            // localStorage.setItem('AuthTypeId', data.typeId);
            // reject(Toast({ type: 'error', message }));
          }
          // Toast({ type: 'success', message, time: 5000 })

          // dispatch({ type: AuthActionType.getUserLoginDetails, payload: Token });

          // if (data.typeId == 1) {
          //   history.push('/admin/adminManagement');
          // } else if (data.typeId == 2) {
          //   history.push('/admin/manageDriver');
          // }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const getLoginSaloon =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...authApi.getSaloon })
        .then(response => {
          resolve(response);
          let { message, status } = response;
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

// Getting user details for header
export const getTokenDetails =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...authApi.getTokenDetails })
        .then(({ data }) => {
          resolve(true);
          localStorage.setItem("AuthTypeId", data.typeId);
          dispatch({ type: AuthActionType.getTokenDetails, payload: data });
        })
        .catch(({ message }) => {
          localStorage.clear();
          history.push("/");
          // window.location.reload(true)
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const addStaff = body => {
  return new Promise((resolve, reject) => {
    api({ ...staff.addStaff, body })
      .then(res => {
        let message = res.Message;
        // Toast({ type: 'error', message: JSON.stringify(message) })
        if (res.status == 200 || res.status == 201) {
          resolve(res);
          return;
        }
        resolve(true);
      })
      .catch(({ message }) => {
        Toast({ type: "error", message: message });
        reject(true);
      });
  });
};

export const addCustomer = body => {
  return new Promise((resolve, reject) => {
    api({ ...customer.addCustomer, body })
      .then(res => {
        let message = res.Message;
        // Toast({ type: 'error', message: JSON.stringify(message) })
        if (res.status == 200 || res.status == 201) {
          resolve(res);
          return;
        }
        resolve(true);
      })
      .catch(({ message }) => {
        Toast({ type: "error", message: message });
        reject(true);
      });
  });
};

export const addService = body => {
  return new Promise((resolve, reject) => {
    api({ ...services.addService, body })
      .then(res => {
        let message = res.Message;
        // Toast({ type: 'error', message: JSON.stringify(message) })
        if (res.status == 200 || res.status == 201) {
          resolve(res);
          return;
        }
        resolve(true);
      })
      .catch(({ message }) => {
        Toast({ type: "error", message: message });
        reject(true);
      });
  });
};

export const addProduct = body => {
  return new Promise((resolve, reject) => {
    api({ ...Products.addProduct, body })
      .then(res => {
        let message = res.Message;
        // Toast({ type: 'error', message: JSON.stringify(message) })
        if (res.status == 200 || res.status == 201) {
          resolve(res);
          return;
        }
        resolve(true);
      })
      .catch(({ message }) => {
        Toast({ type: "error", message: message });
        reject(true);
      });
  });
};

// Forgot password common
export const forgotPassword =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...authApi.forgotPassword, body })
        .then(response => {
          resolve(response);
          let { message } = response;
          //  Toast({ type: "success", message });
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// Forgot password common
export const verifyOtp =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    authApi.verifyOtp.addQuery = { key: "id", payload: id };
    return new Promise((resolve, reject) => {
      api({ ...authApi.verifyOtp, body })
        .then(response => {
          resolve(response);
          let { message } = response;
          // Toast({ type: "success", message });
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
// Forgot password common
export const resetPassword =
  (id, body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      authApi.resetPassword.addQuery = { key: "id", payload: id };
      api({ ...authApi.resetPassword, body })
        .then(response => {
          resolve(response);
          let { message } = response;
          // Toast({ type: "success", message });
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// get method for token verification
export const getTokenVerify =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...authApi.getTokenVerify, body })
        .then(({ data, message }) => {
          resolve(true);
          //resolve(Toast({ type: "success", message }));
          localStorage.setItem("AuthToken", data.jwtToken);
        })
        .catch(({ message }) => {
          history.push("/");
          reject(Toast({ type: "error", message }));
        });
    });
  };

// Change Password after forgot password
export const changePassword =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...authApi.changePassword, body })
        .then(({ message }) => {
          resolve(true);
          // resolve(Toast({ type: "success", message }));
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

// Logout using loged user
export const Logout =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...authApi.logout, body })
        .then(response => {
          resolve(response);
          let { message } = response;
          //Toast({ type: "success", message });
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
