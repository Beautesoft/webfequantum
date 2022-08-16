import { StaffActionType } from 'redux/actions/actionType';

const initialState = {
  staffDetail: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case StaffActionType.getStaffDetail:
      return {
        ...state,
        staffDetail: payload,
      };
    default:
      return state;
  }
};
