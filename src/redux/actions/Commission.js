import { Commission } from "service/apiVariables";

export const Amountapplicable =
  (body) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...Commission.Amountapplicable, body })
        .then((response) => {
          resolve(response);
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const getAmountapplicable =
  (id) =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      Commission.getAmountapplicable.addQuery = { key: "id", payload: id };

      api({ ...Commission.getAmountapplicable })
        .then((response) => {
          resolve(response);
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
