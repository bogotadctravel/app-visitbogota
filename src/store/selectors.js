// Import the necessary dependencies
import { createSelector } from "reselect";

// Define your selectors to access specific parts of the state
const selectFilters = (state) => state.filters;
const selectEvents = (state) => state.events;
const selectRutas = (state) => state.rutas;
const selectHotels = (state) => state.hoteles;
const selectRestaurants = (state) => state.restaurantes;
const selectPlanes = (state) => state.planes;
const selectLanguage = (state) => state.language;
const selectLocation = (state) => state.location;
const selectUser = (state) => state.user;

export const selectPlacesData = createSelector(
  [selectFilters],
  (filters) => filters.places
);

export const selectParaData = createSelector(
  [selectFilters],
  (filters) => filters.para
);

export const selectSubprodData = createSelector(
  [selectFilters],
  (filters) => filters.subproductos
);

export const selectLocalidadesData = createSelector(
  [selectFilters],
  (filters) => filters.localidades
);

export const selectEventsData = createSelector(
  [selectEvents],
  (events) => events.eventsList
);
export const selectBlogsData = createSelector(
  [selectEvents],
  (events) => events.blogsList
);

export const selectEventsFilterData = createSelector(
  [selectEvents],
  (events) => events.filters
);

export const selectRutassData = createSelector(
  [selectRutas],
  (rutas) => rutas.rutasList
);

export const selectHotelsData = createSelector(
  [selectHotels],
  (hoteles) => hoteles.hotelsList
);

export const selectHotelsFilterData = createSelector(
  [selectHotels],
  (hoteles) => hoteles.filters
);
export const selectRestaurantsData = createSelector(
  [selectRestaurants],
  (restaurants) => restaurants.restaurantsList
);

export const selectRestaurantsFilterData = createSelector(
  [selectRestaurants],
  (restaurants) => restaurants.filters
);
export const selectPlanesData = createSelector(
  [selectPlanes],
  (planes) => planes.planesList
);

export const selectPlanesFilterData = createSelector(
  [selectPlanes],
  (planes) => planes.filters
);

export const selectActualLanguage = createSelector(
  [selectLanguage],
  (lang) => lang.language
);
export const selectWordsLang = createSelector(
  [selectLanguage],
  (lang) => lang.words
);
export const selectActualLocation = createSelector(
  [selectLocation],
  (location) => location.location
);
export const selectActualUser = createSelector(
  [selectUser],
  (user) => user.user
);
