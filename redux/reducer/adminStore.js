import { AdminActionType } from "redux/actions/actionType";

const initialState = {
};

export default (state = Object.assign({}, initialState), { type, payload }) => {
    switch (type) {
        default:
            return state;
    }
};
