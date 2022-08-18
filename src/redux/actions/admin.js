import { adminApi } from "service/apiVariables";

export const createAdmin =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...adminApi.createAdmin, body })
        .then(({ message }) => {
          resolve();
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
