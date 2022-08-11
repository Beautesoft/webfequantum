import { multiLanguage } from "service/apiVariables";

//get language data
export const getMultiLanguage =
  body =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      api({ ...multiLanguage.getMultiLanguage, body })
        .then(response => {
          resolve(response);
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
