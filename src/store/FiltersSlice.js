const initialState = {
  para: [],
  subproductos: [],
  localidades: [],
  places: [],
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PLACES_DATA":
      return {
        ...state,
        places: action.payload,
      };
    case "SET_PARA_DATA":
      return {
        ...state,
        para: action.payload,
      };
    case "SET_SUBPRODUCTOS_DATA":
      return {
        ...state,
        subproductos: action.payload,
      };
    case "SET_LOCALIDADES_DATA":
      return {
        ...state,
        localidades: action.payload,
      };
    // ... Handle other data ...
    default:
      return state;
  }
};

export default filtersReducer;
