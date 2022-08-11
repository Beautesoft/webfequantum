import { SaloonActionType } from 'redux/actions/actionType';

const initialState = {
  saloonDetail: {},
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
  switch (type) {
    case SaloonActionType.getSaloonDetail:
      return {
        ...state,
        saloonDetail: payload,
      };
    default:
      return state;
  }
};
