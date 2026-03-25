// actions.js

import { useSelector } from "react-redux";
import {
  fetchBogota,
  fetchBogotaDrpl,
  fetchBogotaDrplV2,
} from "../api/imperdibles";

export const fetchData = () => async (dispatch, getState) => {
  const state = getState();
  const actualLanguage = state.language.language;
  if (state.filters.places.length === 0) {
    try {
      const placesResponse = await fetchBogota("/bestplaces/");
      dispatch(setPlacesData(placesResponse));
    } catch (error) {
      console.error("Error fetching places data:", error);
    }
  }
  if (state.filters.para.length === 0) {
    try {
      const paraResponse = await fetchBogotaDrplV2("/para/all", actualLanguage);
      dispatch(setParaData(paraResponse));
    } catch (error) {
      console.error("Error fetching places data:", error);
    }
  }
  if (state.filters.subproductos.length === 0) {
    try {
      const subproductosResponse = await fetchBogotaDrplV2(
        "/products/all/all",
        actualLanguage
      );
      dispatch(setSubproductosData(subproductosResponse));
    } catch (error) {
      console.error("Error fetching places data:", error);
    }
  }
  if (state.filters.localidades.length === 0) {
    try {
      const localidadesResponse = await fetchBogotaDrplV2(
        "/zones/all",
        actualLanguage
      );
      dispatch(setLocalidadesData(localidadesResponse));
    } catch (error) {
      console.error("Error fetching places data:", error);
    }
  }
};
export const fetchPlacesWithFilters =
  (ID = "all", para = "all", subproduct = "all", localidad = "all") =>
    async (dispatch, getState) => {
      const state = getState();
      const actualLanguage = state.language.language;
      let stringsubProds = "all";
      try {
        if (subproduct != "all") {
          const subRelResponse = await fetchBogotaDrplV2(
            `/subproducts/${subproduct}`,
            actualLanguage
          );
          stringsubProds = subRelResponse.map((item) => item.nid).join("+");
        }
        const endpoint = `/places/${ID}/${para}/${stringsubProds}/${localidad}`;
        const placesResponse = await fetchBogotaDrplV2(endpoint, actualLanguage);
        const uniqueNids = new Set();
        const uniqueData = [];
        for (const item of placesResponse) {
          if (!uniqueNids.has(item.nid)) {
            uniqueNids.add(item.nid);
            uniqueData.push(item);
          }
        }
        dispatch(setPlacesData(uniqueData));
      } catch (error) {
        console.error("Error fetching places data:", error);
      }
    };
export const fetchAllEvents =
  (agenda, zone = "all", cat = "all", startdate = "all", enddate = "all") =>
    async (dispatch, getState) => {
      const state = getState();
      const actualLanguage = state.language.language;
      let filteredEvents;
      try {
        // Formato de fechas en caso de que existan
        const formattedStartDate =
          startdate !== "all"
            ? new Date(startdate).toISOString().split("T")[0]
            : "all";
        const formattedEndDate =
          enddate !== "all"
            ? new Date(enddate).toISOString().split("T")[0]
            : "all";
        let endpoint, eventsResponse;
        if (formattedStartDate !== "all" || formattedEndDate !== "all") {
          endpoint = `/eventslist/all/${zone}/${cat}/${agenda}`;
          eventsResponse = await fetchBogotaDrplV2(endpoint, actualLanguage, {
            field_date_value: formattedStartDate,
            field_end_date_value: formattedEndDate,
          });
          // Filtrado de eventos por la fecha de finalización
          filteredEvents = eventsResponse.filter((event) => {
            const eventEndDate = event.field_end_date
              ? new Date(event.field_end_date).toISOString().split("T")[0]
              : null;
            const eventStartDate = event.field_date
              ? new Date(event.field_date).toISOString().split("T")[0]
              : null;

            if (formattedEndDate !== "all" && eventEndDate) {
              // Si tiene fecha de finalización, compararla con formattedEndDate
              return eventEndDate <= formattedEndDate;
            } else if (eventStartDate && formattedStartDate !== "all") {
              // Si no tiene fecha de finalización, asegurarse que la fecha de inicio no sea mayor que la fecha de inicio proporcionada
              return eventStartDate <= formattedEndDate;
            }
            return true;
          });
        } else {
          endpoint = `/eventslist/all/${zone}/${cat}/${agenda}`;
          eventsResponse = await fetchBogotaDrplV2(endpoint, actualLanguage, {
            langcode_1: actualLanguage,
          });
          filteredEvents = eventsResponse;
        }

        // Filtrado de datos únicos
        const uniqueNids = new Set();
        const uniqueData = [];
        for (const item of filteredEvents) {
          if (!uniqueNids.has(item.nid)) {
            uniqueNids.add(item.nid);
            uniqueData.push(item);
          }
        }

        // Función para ajustar la hora a medianoche
        function setMidnight(dateString) {
          const date = new Date(dateString);
          date.setHours(0, 0, 0, 0);
          return date;
        }

        // Función para comparar fechas (utiliza fecha de finalización o de inicio si no hay)
        function compararFechas(a, b) {
          const endDateA = a.field_end_date
            ? a.field_end_date.length === 10
              ? setMidnight(a.field_end_date)
              : new Date(a.field_end_date)
            : setMidnight(a.field_date);
          const endDateB = b.field_end_date
            ? b.field_end_date.length === 10
              ? setMidnight(b.field_end_date)
              : new Date(b.field_end_date)
            : setMidnight(b.field_date);

          return endDateA - endDateB;
        }

        // Ordenar los datos por fecha de finalización
        uniqueData.sort(compararFechas);

        // Despachar los datos al estado
        dispatch(setEventsData(uniqueData));
      } catch (error) {
        console.error("Error fetching events data:", error);
      }
    };

export const fetchAllRutas = () => async (dispatch, getState) => {
  const state = getState();
  const actualLanguage = state.language.language;
  try {
    // ID
    // Zona Relacionada
    // Categoría Evento
    // Agenda de Evento
    const endpoint = `/rt/all`;
    const rutasResponse = await fetchBogotaDrplV2(endpoint, actualLanguage);
    const uniqueNids = new Set();
    const uniqueData = [];
    for (const item of rutasResponse) {
      if (!uniqueNids.has(item.nid)) {
        uniqueNids.add(item.nid);
        uniqueData.push(item);
      }
    }
    dispatch(setRutasData(uniqueData));
  } catch (error) {
    console.error("Error fetching places data:", error);
  }
};
export const fetchAllBlogs = () => async (dispatch, getState) => {
  const state = getState();
  const actualLanguage = state.language.language;
  try {
    // ID
    // Zona Relacionada
    // Categoría Evento
    // Agenda de Evento
    const endpoint = `/blog/all/all`;
    const eventsResponse = await fetchBogotaDrplV2(endpoint, actualLanguage);
    const uniqueNids = new Set();
    const uniqueData = [];
    for (const item of eventsResponse) {
      if (!uniqueNids.has(item.nid)) {
        uniqueNids.add(item.nid);
        uniqueData.push(item);
      }
    }
    dispatch(setBlogsData(uniqueData));
  } catch (error) {
    console.error("Error fetching places data:", error);
  }
};
export const fetchAllHoteles = () => async (dispatch, getState) => {
  const state = getState();
  const actualLanguage = state.language.language;
  try {
    // ID
    // Zona Relacionada
    // Categoría Evento
    // Agenda de Evento
    const endpoint = `/hotels/all/all/all/all/all`;
    const eventsResponse = await fetchBogotaDrplV2(endpoint, actualLanguage);
    const uniqueNids = new Set();
    const uniqueData = [];
    for (const item of eventsResponse) {
      if (!uniqueNids.has(item.nid)) {
        uniqueNids.add(item.nid);
        uniqueData.push(item);
      }
    }
    dispatch(setHotelsData(uniqueData));
  } catch (error) {
    console.error("Error fetching places data:", error);
  }
};
export const fetchAllRestaurants = (zone) => async (dispatch, getState) => {
  const state = getState();
  const actualLanguage = state.language.language;
  try {
    // ID
    // Categoria Restaurante
    // Zona de la ciudad
    // Zona Gastronómica relacionada
    // Rango de precios
    const endpoint = `/restaurants/all/all/all/${zone}/all`;
    const eventsResponse = await fetchBogotaDrplV2(endpoint, actualLanguage);
    const uniqueNids = new Set();
    const uniqueData = [];
    for (const item of eventsResponse) {
      if (!uniqueNids.has(item.nid)) {
        uniqueNids.add(item.nid);
        uniqueData.push(item);
      }
    }
    dispatch(setRestaurantsData(uniqueData));
  } catch (error) {
    console.error("Error fetching places data:", error);
  }
};
export const fetchAllPLanes = () => async (dispatch, getState) => {
  const state = getState();
  const actualLanguage = state.language.language;
  try {
    const endpoint = `/all_ofertas/all/all/all/all/all`;
    const eventsResponse = await fetchBogotaDrplV2(endpoint, actualLanguage);
    const uniqueNids = new Set();
    const uniqueData = [];
    for (const item of eventsResponse) {
      if (item.field_img != "") {
        if (!uniqueNids.has(item.nid)) {
          uniqueNids.add(item.nid);
          uniqueData.push(item);
        }
      }
    }
    dispatch(setPlanesData(uniqueData));
  } catch (error) {
    console.error("Error fetching places data:", error);
  }
};
export const fetchAllFilters =
  (filters, filterType) => async (dispatch, getState) => {
    const state = getState();
    const actualLanguage = state.language.language;

    // 🔥 Dispatch dinámico según el tipo
    const dispatchMap = {
      hoteles: setFiltersHotelsData,
      restaurantes: setFiltersRestaurantssData,
      eventos: setFiltersEventData,
      planes: setFiltersPlanesData,
    };

    const selectedDispatch = dispatchMap[filterType];

    if (!selectedDispatch) {
      console.error("❌ filterType no soportado:", filterType);
      return;
    }

    try {
      const arrayFilters = await Promise.all(
        filters.map(async (filter) => {
          // 🔥 Lógica unificada igual a "planes"
          if (filter === "categorias_atractivos_2024") {
            return await fetchBogotaDrplV2(`/categorias_atractivos/all`);
          } else {
            return await fetchBogotaDrpl(`/tax/${filter}`);
          }
        })
      );

      // 🔥 Dispatch dinámico
      dispatch(selectedDispatch({ filters: arrayFilters, filterType }));

      return arrayFilters; // opcional pero útil como en "planes"
    } catch (error) {
      console.error("❌ Error fetching filters data:", error);
      throw error;
    }
  };

export const fetchAllWords = () => async (dispatch) => {
  const langs = ["es", "en", "fr", "pt-br"];

  const reemplazarCaracteresEspeciales = (arr) =>
    arr.map((palabra) => palabra.replace(/&#039;/g, "'"));

  try {
    const wordsByLang = await Promise.all(
      langs.map(async (lang) => {
        const response = await fetchBogotaDrplV2(
          `/palabras_interfaz/3273`,
          lang
        );

        if (!response || !response[0]?.field_palabras) {
          throw new Error(`❌ Respuesta no válida para ${lang}`);
        }

        const palabrasArray = response[0].field_palabras.split("|");
        const palabrasDecodificadas =
          reemplazarCaracteresEspeciales(palabrasArray);
        return { [lang]: palabrasDecodificadas };
      })
    );

    const resultObject = wordsByLang.reduce((acc, langObject) => {
      return { ...acc, ...langObject };
    }, {});

    dispatch(setAllWords(resultObject));
  } catch (error) {
    console.error("🔥 Error en fetchAllWords:", error);
    throw error; // <- Lanzamos el error para que LoadingScreen lo capture
  }
};

export const setPlacesData = (data) => {
  return {
    type: "SET_PLACES_DATA",
    payload: data,
  };
};
export const setEventsData = (data) => {
  return {
    type: "SET_EVENTS_DATA",
    payload: data,
  };
};
export const setBlogsData = (data) => {
  return {
    type: "SET_BLOGS_DATA",
    payload: data,
  };
};
export const setRutasData = (data) => {
  return {
    type: "SET_RUTAS_DATA",
    payload: data,
  };
};
export const setHotelsData = (data) => {
  return {
    type: "SET_HOTELS_DATA",
    payload: data,
  };
};
export const setRestaurantsData = (data) => {
  return {
    type: "SET_REST_DATA",
    payload: data,
  };
};
export const setPlanesData = (data) => {
  return {
    type: "SET_PLANES_DATA",
    payload: data,
  };
};
export const setFiltersData = (filters, filterType) => {
  return {
    type: "SET_FILTERS_DATA",
    payload: {
      filters,
      filterType,
    },
  };
};
export const setFiltersHotelsData = (data) => {
  return {
    type: "SET_HOTELS_FILTER_DATA",
    payload: data,
  };
};
export const setFiltersRestaurantssData = (data) => {
  return {
    type: "SET_REST_FILTER_DATA",
    payload: data,
  };
};
export const setFiltersEventData = (data) => {
  return {
    type: "SET_EVENTS_FILTER_DATA",
    payload: data,
  };
};
export const setFiltersPlanesData = (data) => {
  return {
    type: "SET_PLANES_FILTER_DATA",
    payload: data,
  };
};
export const setParaData = (data) => {
  return {
    type: "SET_PARA_DATA",
    payload: data,
  };
};
export const setSubproductosData = (data) => {
  return {
    type: "SET_SUBPRODUCTOS_DATA",
    payload: data,
  };
};
export const setLocalidadesData = (data) => {
  return {
    type: "SET_LOCALIDADES_DATA",
    payload: data,
  };
};
export const setLanguage = (language = "es") => ({
  type: "SET_LANGUAGE",
  payload: language,
});
export const setAllWords = (words) => ({
  type: "GET_ALL_WORDS_LANGUAGE",
  payload: words,
});
export const setLocation = (location) => ({
  type: "SET_LOCATION",
  payload: location,
});
export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});
export const logOutUser = () => ({
  type: "LOGOUT_USER",
});
export const setAppInitialized = () => ({
  type: "SET_INITIALIZED",
});
