import { AuthActionType } from 'redux/actions/actionType';

const initialState = {
  userLoginDetails: {},
  tokenDetails: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case AuthActionType.getUserLoginDetails:
      return {
        ...state,
        userLoginDetails: payload,
      };
    case AuthActionType.getTokenDetails:
      return {
        ...state,
        tokenDetails: payload,
      };
    default:
      return state;
  }
};
