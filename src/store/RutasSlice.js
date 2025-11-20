const initialState = {
  rutasList: [],
};

const RutasReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RUTAS_DATA":
      return {
        ...state,
        rutasList: action.payload,
      };
    default:
      return state;
  }
};

export default RutasReducer;
