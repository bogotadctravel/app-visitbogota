import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./FiltersSlice";
import languageReducer from "./languageReducer";
import EventsReducer from "./EventsSlice";
import HotelsReducer from "./HotelsSlice";
import RestaurantsReducer from "./RestaurantsSlice";
import planesReducer from "./PlanesSlice";
import LocationReducer from "./LocationSlice";
import UserReducer from "./UserReducer";
import RutasReducer from "./RutasSlice";
const isDev = process.env.NODE_ENV === "development";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    language: languageReducer,
    events: EventsReducer,
    hoteles: HotelsReducer,
    restaurantes: RestaurantsReducer,
    planes: planesReducer,
    location: LocationReducer,
    user: UserReducer,
    rutas: RutasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: isDev ? false : true,
    }),
});
