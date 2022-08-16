import { AuthActionType } from "redux/actions/actionType";
import { authApi } from "service/apiVariables";
import { addQuery } from "service/helperFunctions";
import { history } from "../../helpers";
import {
  Salon,
  staff,
  customer,
  Services,
  Products,
} from "../../service/apiVariables";
import { api } from "../../service/api";
import { Toast } from "../../service/toast";
import { NotificationManager } from "react-notifications";

export const CreateStaff =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...staff.addCustomer, body })
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
