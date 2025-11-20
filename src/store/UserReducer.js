const initialState = {
  user: null,
  save_places: [],
};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_SAVED_PLACES":
      return {
        ...state,
        save_places: action.payload,
      };
    case "LOGOUT_USER":
      return initialState;
    default:
      return state;
  }
};

export default UserReducer;
