const initialState = {
  location: null,
};

const LocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_LOCATION":
      return {
        ...state,
        location: action.payload,
      };
    default:
      return state;
  }
};

export default LocationReducer;
