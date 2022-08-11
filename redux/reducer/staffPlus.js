import { StaffPlusActionType } from "redux/actions/actionType";

const initialState = {
  staffPlusDetail: {},
  staffPlusWorkScheduleDetails: {},
  staffPlusSchedule: {},
  staffPlusAllEmpSchedule: {},
  staffPlusSkillList: {},
  staffPlustEmpSkillList: {},
  staffPlusAuthorization: {},
  staffPlusIndividualAuthorization: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case StaffPlusActionType.getStaffPlusDetail:
      return {
        ...state,
        staffPlusDetail: payload,
      };
    case StaffPlusActionType.getStaffPlusWorkSchedule:
      return {
        ...state,
        staffPlusWorkScheduleDetails: payload,
      };
    case StaffPlusActionType.getStaffPlusSchedule:
      return {
        ...state,
        staffPlusSchedule: payload,
      };
    case StaffPlusActionType.getStaffPlusSkillList:
      return {
        ...state,
        staffPlusSkillList: payload,
      };
    case StaffPlusActionType.getEmpEmpSkillList:
      return {
        ...state,
        staffPlustEmpSkillList: payload,
      };
    case StaffPlusActionType.getStaffPlusAllEmpSchedule:
      return {
        ...state,
        staffPlusAllEmpSchedule: payload,
      };
    case StaffPlusActionType.getAuthorizationSettings:
      return {
        ...state,
        staffPlusAuthorization: payload,
      };
    case StaffPlusActionType.getIndividualAuthorizationSettings:
      return {
        ...state,
        staffPlusIndividualAuthorization: payload,
      };
    default:
      return state;
  }
};
