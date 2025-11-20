const initialState = {
  eventsList: [],
  blogsList: [],
  filters: [],
  filterType: "",
};

const EventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EVENTS_DATA":
      return {
        ...state,
        eventsList: action.payload,
      };
    case "SET_BLOGS_DATA":
      return {
        ...state,
        blogsList: action.payload,
      };
    case "SET_EVENTS_FILTER_DATA":
      return {
        ...state,
        filters: action.payload.filters,
        filterType: action.payload.filterType,
      };
    default:
      return state;
  }
};

export default EventsReducer;
