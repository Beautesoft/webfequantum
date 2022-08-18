import { CommonActionType } from 'redux/actions/actionType';

const initialState = {
  branchList: [],
  jobtitleList: [],
  shiftList: [],
  categoryList: [],
  skillsList: [],
  customerList: [
    { label: "Narasim", value: 4 },
    { label: "Monica", value: 3 }
  ],
  selected_cstomer: {},
  slectedCart: {}
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case CommonActionType.getBranchList:
      return {
        ...state,
        branchList: payload,
      };
    case CommonActionType.getJobtitleList:
      return {
        ...state,
        jobtitleList: payload,
      };
    case CommonActionType.getShiftList:
      return {
        ...state,
        shiftList: payload,
      };
    case CommonActionType.getCategoryList:
      return {
        ...state,
        categoryList: payload,
      };
    case CommonActionType.getSkillsList:
      return {
        ...state,
        skillsList: payload,
      };
    case CommonActionType.getCustomerList:
      return {
        ...state,
        customerList: payload,
      };
    case "selected_customer":
      return {
        ...state,
        selected_cstomer: payload,
      };
    case "selectedCart":
      return {
        ...state,
        selectedCart: payload,
      };
    default:
      return state;
  }
};
