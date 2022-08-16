import { KPIActionType } from "redux/actions/actionType";
import { KPI } from "../../service/apiVariables";

export const getDailyCollections =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      KPI.getDailyCollections.addQuery = { key: "id", payload: id };
      api({
        ...KPI.getDailyCollections,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: KPIActionType.getDailyCollections,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const getMonthlyCollections =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      KPI.getMonthlyCollections.addQuery = { key: "id", payload: id };
      api({
        ...KPI.getMonthlyCollections,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: KPIActionType.getMonthlyCollections,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const getConsultantCollections =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      KPI.getConsultantCollections.addQuery = { key: "id", payload: id };
      api({
        ...KPI.getConsultantCollections,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: KPIActionType.getConsultantCollections,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const getRankingByOutlet =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      KPI.getRankingByOutlet.addQuery = { key: "id", payload: id };
      api({
        ...KPI.getRankingByOutlet,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: KPIActionType.getRankingByOutlet,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const getSalesRankingByConsultant =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      KPI.getSalesRankingByConsultant.addQuery = { key: "id", payload: id };
      api({
        ...KPI.getSalesRankingByConsultant,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: KPIActionType.getConsultantSalesRanking,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };

export const getServiceRankingByOutlet =
  id =>
  (dispatch, getState, { api, Toast }) => {
    return new Promise((resolve, reject) => {
      KPI.getServicesRankingByConsultant.addQuery = { key: "id", payload: id };
      api({
        ...KPI.getServicesRankingByConsultant,
      })
        .then(response => {
          resolve(response);
          let { message, status, data } = response;
          if (status === 200 || status === 201) {
            dispatch({
              type: KPIActionType.getConsultantServiceRanking,
              payload: data,
            });
          } else {
            reject(Toast({ type: "error", message }));
          }
        })
        .catch(({ message }) => {
          reject(Toast({ type: "error", message }));
        });
    });
  };
