import { KPIActionType } from "redux/actions/actionType";

const initialState = {
  dailyCollections: {},
  monthlyCollections: {},
  consultantCollections: {},
  rankingByOutlet: {},
  salesRankingByConsultant: {},
  serviceRankingByConsultant: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case KPIActionType.getDailyCollections:
      return {
        ...state,
        dailyCollections: payload,
      };
    case KPIActionType.getMonthlyCollections:
      return {
        ...state,
        monthlyCollections: payload,
      };
    case KPIActionType.getConsultantCollections:
      return {
        ...state,
        consultantCollections: payload,
      };
    case KPIActionType.getRankingByOutlet:
      return {
        ...state,
        rankingByOutlet: payload,
      };
    case KPIActionType.getConsultantSalesRanking:
      return {
        ...state,
        salesRankingByConsultant: payload,
      };
    case KPIActionType.getConsultantServiceRanking:
      return {
        ...state,
        serviceRankingByConsultant: payload,
      };
    default:
      return state;
  }
};
