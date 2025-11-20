const initialState = {
  restaurantsList: [],
  filters: [],
  filterType: "",
};

const RestaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_REST_DATA":
      return {
        ...state,
        restaurantsList: action.payload,
      };
    case "SET_REST_FILTER_DATA":
      return {
        ...state,
        filters: action.payload.filters,
        filterType: action.payload.filterType,
      };
    case "SET_FILTERS_DATA":
      return {
        ...state,
        filters: action.payload,
      };
    default:
      return state;
  }
};

export default RestaurantsReducer;
