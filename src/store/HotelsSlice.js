const initialState = {
  hotelsList: [],
  filters: [],
  filterType: "",
};

const HotelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_HOTELS_DATA":
      return {
        ...state,
        hotelsList: action.payload,
      };
    case "SET_HOTELS_FILTER_DATA":
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

export default HotelsReducer;
