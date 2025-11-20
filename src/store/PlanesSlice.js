const initialState = {
  planesList: [],
  filters: [],
  filterType: "",
};

const planesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PLANES_DATA":
      return {
        ...state,
        planesList: action.payload,
      };
    case "SET_PLANES_FILTER_DATA":
      return {
        ...state,
        filters: action.payload.filters,
        filterType: action.payload.filterType,
      };
    case "SET_FILTERS_DATA":
      return {
        ...state,
        filters: action.payload.filters,
      };
    default:
      return state;
  }
};

export default planesReducer;
