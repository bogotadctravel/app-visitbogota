// React & Hooks
import React, { useRef } from "react";

// Componentes de React Native
import {
  View, // Contenedor genérico para layout
  Text, // Componente de texto
  Pressable, // Botón interactivo
  Button, // Componente de botón
  ScrollView, // Vista para scroll
  Modal, // Componente modal
  StyleSheet, // Estilos en línea para componentes
  TextInput, // Entrada de texto
  Alert,
} from "react-native";

// Componentes adicionales de react-native
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"; // Manejo de gestos y listas
import { FontAwesome } from "@expo/vector-icons"; // Iconos de FontAwesome

// Redux - Para el manejo de estado global
import { useDispatch, useSelector } from "react-redux";
import { fetchAllEvents, fetchAllFilters } from "../../../src/store/actions"; // Acciones para manejar eventos y filtros

// Selectores - Para obtener datos específicos del estado global (Redux)
import {
  selectActualLanguage, // Selector para el idioma actual
  selectEventsData, // Selector para los datos de eventos
  selectEventsFilterData, // Selector para los datos de filtros
  selectWordsLang, // Selector para palabras según el idioma
} from "../../../src/store/selectors";

// Componentes personalizados de la app
import { CustomCheckbox, PreloaderComponent } from "../../../src/components"; // Checkbox, preloader y switch personalizados
import CardEvento from "../../../src/components/CardEventos"; // Componente para mostrar una tarjeta de evento
import IconSvg from "../../../src/components/IconSvg"; // Componente para manejar iconos SVG personalizados

// Router - Para navegar entre pantallas
import { router } from "expo-router";

// Funciones de la API - Para realizar fetch de datos
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles"; // Función para obtener eventos desde una API

// Constantes - Datos y configuraciones constantes de la app
import { windowHeight } from "../../../src/constants/ScreenWidth"; // Altura de la ventana
import { Colors } from "../../../src/constants"; // Colores constantes de la app

// DateTime Picker - Para seleccionar fechas
import DateTimePicker from "@react-native-community/datetimepicker";

const CustomModal = ({
  visible,
  closeModal,
  categorias_eventos,
  filteredCategories,
  filteredZones,
  setcategorias_eventos,
  test_zona,
  settest_zona,
  limpiarFiltros,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);

  // Estados para controlar la visibilidad del DateTimePicker
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);

  // Función para validar y establecer la fecha de inicio
  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Establecer la hora actual a medianoche para comparación
      if (selectedDate < today) {
        Alert.alert(
          "Fecha inválida",
          "La fecha de inicio no puede ser anterior a hoy."
        );
        return;
      }
      setStartDate(selectedDate);
    }
  };

  // Función para validar y establecer la fecha de finalización
  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      if (startDate && selectedDate < startDate) {
        Alert.alert(
          "Fecha inválida",
          "La fecha de finalización no puede ser anterior a la fecha de inicio."
        );
        return;
      }
      setEndDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={closeModal}
      animationType="slide"
      transparent
    >
      <View
        style={{
          paddingVertical: 50,
          flex: 1,
          backgroundColor: "rgba(255,255,255,.9)",
        }}
      >
        <Pressable
          style={{ marginBottom: 10, alignSelf: "center" }}
          onPress={() => closeModal(false)}
        >
          <FontAwesome name="close" size={30} color="#354999" />
        </Pressable>
        <ScrollView>
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <Text style={stylesModal.titleFilter}>Categoría de Evento</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {filteredCategories.map((item, index) => {
                const isChecked = categorias_eventos.includes(item.tid);
                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setcategorias_eventos((prevState) =>
                          isChecked
                            ? prevState.filter((id) => id !== item.tid)
                            : [...prevState, item.tid]
                        );
                      }}
                    />
                  </View>
                );
              })}
            </View>

            <Text style={stylesModal.titleFilter}>Zona de la ciudad</Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {filteredZones.map((item, index) => {
                const isChecked = test_zona.includes(item.tid);
                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        settest_zona((prevState) =>
                          isChecked
                            ? prevState.filter((id) => id !== item.tid)
                            : [...prevState, item.tid]
                        );
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <Text style={stylesModal.titleFilter}>Fecha de Inicio</Text>
            {/* Botón para mostrar el picker de fecha de inicio */}
            <Pressable
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {startDate
                  ? startDate.toLocaleDateString(
                      actualLanguage == "es" ? "es-ES" : "en-US"
                    )
                  : "Seleccionar fecha de inicio"}
              </Text>
            </Pressable>

            {/* Mostrar el DateTimePicker si showStartPicker es true */}
            {showStartPicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={onStartDateChange}
              />
            )}

            <Text style={stylesModal.titleFilter}>Fecha de finalización</Text>

            <Pressable
              onPress={() => setShowEndPicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {endDate
                  ? endDate.toLocaleDateString(
                      actualLanguage == "es" ? "es-ES" : "en-US"
                    )
                  : "Seleccionar fecha de finalización"}
              </Text>
            </Pressable>

            {/* Mostrar el DateTimePicker si showEndPicker es true */}
            {showEndPicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={onEndDateChange}
              />
            )}
          </View>
          <View style={{ marginVertical: 10, paddingHorizontal: 20 }}>
            <Pressable onPress={closeModal} style={styles.btnStyle}>
              <Text style={styles.btnText}>
                {wordsLanguage[actualLanguage][27]}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                limpiarFiltros();
                closeModal();
              }}
              style={styles.btnStyle}
            >
              <Text style={styles.btnText}>
                {wordsLanguage[actualLanguage][28]}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const stylesModal = StyleSheet.create({
  titleFilter: {
    color: "#333",
    fontSize: 25,
    fontFamily: "MuseoSans_500",
    textAlign: "center",
    paddingVertical: 8,
  },
});

const EventsList = () => {
  const flatListRef = useRef(null);
  const dispatch = useDispatch();
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const eventsData = useSelector(selectEventsData);
  const filtersData = useSelector(selectEventsFilterData);

  const [filteredData, setFilteredData] = React.useState(eventsData);
  const [searchValue, setSearchValue] = React.useState("");
  const [queriesCompleted, setQueriesCompleted] = React.useState(false);
  const [agendas, setAgendas] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeAgenda, setActiveAgenda] = React.useState(148);
  // FILTERS
  const [filterModal, setFilterModal] = React.useState(false);
  const [categorias_eventos, setcategorias_eventos] = React.useState([]);
  const [test_zona, settest_zona] = React.useState([]);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [filteredCategories, setFilteredCategories] = React.useState([]);
  const [filteredZones, setFilteredZones] = React.useState([]);
  // Filtrar los datos cuando searchValue cambia
  React.useEffect(() => {
    if (
      searchValue === "" &&
      categorias_eventos.length === 0 &&
      test_zona.length === 0 &&
      !startDate &&
      !endDate
    ) {
      setFilteredData(eventsData); // Si no hay filtros, mostrar todos los eventos
      if (!filtersData || filtersData.length === 0) {
        return; // ❗ Evita que ejecute el filtrado sin filtros cargados
      }

      // Llenar todos los filtros al inicio
      filtrarPlanes({
        categorias_eventos: [],
        test_zona: [],
        startDate: null,
        endDate: null,
      });
    } else {
      filtrarPlanes({
        categorias_eventos,
        test_zona,
        startDate,
        endDate,
      });
    }
  }, [
    searchValue,
    categorias_eventos,
    test_zona,
    startDate,
    endDate,
    eventsData,
  ]);

  React.useEffect(() => {
    async function getFilters() {
      dispatch(fetchAllFilters(["categorias_eventos", "test_zona"], "eventos"));
    }
    getFilters();
  }, [dispatch, actualLanguage]);
  // Función para filtrar los eventos y actualizar los selectores
  const filtrarPlanes = async (data) => {
    const { categorias_eventos, test_zona, startDate, endDate } = data || {};

    // Aplicar los filtros sobre los datos de eventos
    const filtered = eventsData.filter((item) => {
      // Filtrar por categoría, zona, título, fecha de inicio y fin
      const matchesCategory =
        categorias_eventos.length === 0 ||
        categorias_eventos.includes(item.field_categoria_evento);

      const matchesZone =
        test_zona.length === 0 ||
        test_zona.includes(item.field_zona_relacionada);
      const matchesTitle =
        searchValue === "" ||
        item.title.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStartDate =
        !startDate || new Date(item.field_date) >= new Date(startDate);
      const matchesEndDate =
        !endDate || new Date(item.field_end_date) <= new Date(endDate);

      return (
        matchesCategory &&
        matchesZone &&
        matchesTitle &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    // Actualizar el estado con los datos filtrados
    setFilteredData(filtered);

    // Actualizar dinámicamente las opciones de categorías y zonas visibles
    const visibleCategories = new Set(
      filtered.map((item) => item.field_categoria_evento)
    );
    const visibleZones = new Set(
      filtered.map((item) => item.field_zona_relacionada)
    );

    // Filtrar las categorías y zonas en los selects que tengan eventos visibles
    if (!filtersData || filtersData.length < 2) {
      return;
    }

    const updatedCategories = filtersData[0].filter((category) =>
      visibleCategories.has(category.tid)
    );

    const updatedZones = filtersData[1].filter((zone) =>
      visibleZones.has(zone.tid)
    );

    // Actualizar el estado con las categorías y zonas filtradas
    setFilteredCategories(updatedCategories);

    setFilteredZones(updatedZones);
  };
  // Función para limpiar los filtros
  const limpiarFiltros = async () => {
    setcategorias_eventos([]);
    settest_zona([]);
    setSearchValue("");
    setStartDate(null);
    setEndDate(null);
    setFilteredData(eventsData); // Mostrar todos los eventos nuevamente
  };
  const openModal = () => {
    setFilterModal(true);
  };

  const closeModal = () => {
    setFilterModal(false);
  };

  React.useEffect(() => {
    async function fetchData() {
      const agenda = await fetchBogotaDrplV2(
        "/tax/agenda_de_evento_/all",
        actualLanguage
      );
      setAgendas(agenda);

      await dispatch(fetchAllEvents(activeAgenda)); // Cargar los eventos
      setQueriesCompleted(true);
    }
    fetchData();
    setFilteredData(eventsData);
  }, [actualLanguage, activeIndex, activeAgenda]);
  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };
  if (!queriesCompleted) {
    return <PreloaderComponent />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CustomModal
        visible={filterModal}
        closeModal={closeModal}
        queriesCompleted={queriesCompleted}
        filtrarPlanes={filtrarPlanes}
        limpiarFiltros={limpiarFiltros}
        categorias_eventos={categorias_eventos}
        setcategorias_eventos={setcategorias_eventos}
        test_zona={test_zona}
        settest_zona={settest_zona}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        filteredCategories={filteredCategories}
        setFilteredCategories={setFilteredCategories}
        filteredZones={filteredZones}
        setFilteredZones={setFilteredZones}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 20,
          gap: 8,
        }}
      >
        <IconSvg
          width="25"
          height="25"
          icon={`<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.4625 0H15.8675C15.8799 0.0124604 15.894 0.0232619 15.9092 0.0321386C16.1882 0.0936232 16.4349 0.255024 16.6031 0.48591C16.7712 0.716796 16.8491 1.00122 16.822 1.28554V1.92832C16.9923 1.92832 17.1434 1.92832 17.2944 1.92832C17.5676 1.9297 17.8351 2.00592 18.068 2.14871C18.3009 2.2915 18.4902 2.49538 18.6153 2.73821C18.6918 2.90331 18.7552 3.07417 18.8049 3.24921V17.4802C18.8049 17.4802 18.8049 17.4995 18.7856 17.5123C18.72 17.9001 18.5096 18.2484 18.197 18.4871C17.8844 18.7257 17.4929 18.8368 17.1016 18.7979H1.69755C0.643404 18.8043 0.00063239 18.1712 0.00063239 17.1202V8.21141C0.00063239 6.63448 0.00063239 5.0554 0.00063239 3.47418C-0.0100393 3.10417 0.114663 2.74298 0.351345 2.45837C0.588027 2.17376 0.920424 1.98529 1.28618 1.92832C1.51784 1.90431 1.75069 1.89358 1.98358 1.89618C1.98358 1.64871 1.98358 1.41088 1.98358 1.17306C1.98353 0.922809 2.06372 0.679136 2.21239 0.47783C2.36105 0.276525 2.57035 0.128198 2.80955 0.0546356L2.9381 0H3.34305C4.11759 0.279606 4.33291 0.588136 4.33291 1.42053V1.89618H8.23133C8.23133 1.64228 8.23133 1.40446 8.23133 1.16342C8.23131 0.95386 8.28885 0.748323 8.39767 0.569232C8.50648 0.390141 8.66239 0.244375 8.84839 0.147838C8.96909 0.0899922 9.09366 0.0405943 9.2212 0L9.62293 0C9.62293 0 9.65185 0.0257109 9.66792 0.0289247C9.94269 0.0899717 10.1862 0.248038 10.3539 0.47413C10.5215 0.700222 10.602 0.979179 10.5807 1.25983V1.9026H14.463C14.463 1.64871 14.463 1.40767 14.463 1.16342C14.4655 0.950788 14.5269 0.74302 14.6404 0.563178C14.7539 0.383337 14.915 0.238457 15.1058 0.144624C15.2213 0.0885478 15.3405 0.040233 15.4625 0ZM18.0722 7.05121H11.0627C10.9656 7.05121 10.8724 7.01261 10.8037 6.9439C10.735 6.87519 10.6964 6.782 10.6964 6.68483C10.6964 6.58766 10.735 6.49447 10.8037 6.42576C10.8724 6.35705 10.9656 6.31845 11.0627 6.31845C11.1174 6.31845 11.172 6.31845 11.2266 6.31845H18.069V3.39062C18.0672 3.35352 18.0607 3.3168 18.0497 3.28135C17.9115 2.74464 17.4583 2.5518 16.822 2.67393V3.18815C16.8216 3.34304 16.7906 3.49633 16.731 3.63927C16.6713 3.78221 16.5841 3.912 16.4742 4.02123C16.3644 4.13046 16.2341 4.21698 16.0909 4.27587C15.9476 4.33475 15.7942 4.36484 15.6393 4.36442C15.4844 4.364 15.3311 4.33307 15.1881 4.27341C15.0452 4.21374 14.9154 4.12651 14.8062 4.01669C14.697 3.90686 14.6104 3.7766 14.5516 3.63334C14.4927 3.49007 14.4626 3.33661 14.463 3.18172V2.65786H10.5807V3.18493C10.589 3.34436 10.5648 3.50382 10.5095 3.6536C10.4543 3.80337 10.3691 3.94033 10.2592 4.05613C10.1493 4.17193 10.017 4.26414 9.8703 4.32716C9.72361 4.39017 9.56564 4.42267 9.40599 4.42267C9.24635 4.42267 9.08837 4.39017 8.94169 4.32716C8.79501 4.26414 8.66269 4.17193 8.55279 4.05613C8.44289 3.94033 8.35771 3.80337 8.30245 3.6536C8.24718 3.50382 8.22299 3.34436 8.23133 3.18493V2.65465H4.33291C4.33291 2.83784 4.33291 3.00817 4.33291 3.17851C4.33097 3.31202 4.31262 3.44478 4.27828 3.57381C4.20043 3.83792 4.03144 4.06586 3.80135 4.2171C3.57126 4.36834 3.29498 4.43306 3.02166 4.39977C2.74271 4.36466 2.48547 4.23106 2.29632 4.02305C2.10716 3.81504 1.99854 3.54631 1.99001 3.26528C1.99001 3.06281 1.99001 2.85712 1.99001 2.64501H1.62685C1.50696 2.63297 1.38591 2.64774 1.27243 2.68822C1.15895 2.7287 1.05589 2.7939 0.970695 2.8791C0.885501 2.96429 0.820304 3.06735 0.779819 3.18083C0.739335 3.29431 0.724575 3.41536 0.736606 3.53525V6.32166H7.5982C7.6656 6.31685 7.73326 6.31685 7.80067 6.32166C7.88643 6.33571 7.9644 6.37979 8.02066 6.44602C8.07692 6.51225 8.10781 6.59632 8.10781 6.68322C8.10781 6.77012 8.07692 6.85419 8.02066 6.92042C7.9644 6.98665 7.88643 7.03073 7.80067 7.04478C7.73326 7.0496 7.6656 7.0496 7.5982 7.04478H0.736606V15.6708C0.719079 15.7966 0.730912 15.9247 0.771179 16.0452C0.811446 16.1656 0.879052 16.2751 0.968704 16.3651C1.05836 16.455 1.16762 16.523 1.28793 16.5637C1.40825 16.6044 1.53635 16.6167 1.6622 16.5996H17.1401C17.2658 16.6169 17.3937 16.605 17.5139 16.5649C17.6342 16.5248 17.7437 16.4576 17.8338 16.3684C17.9239 16.2792 17.9923 16.1705 18.0336 16.0506C18.075 15.9308 18.0882 15.803 18.0722 15.6772V7.05121ZM18.0722 17.1106C17.7126 17.2982 17.3059 17.3765 16.9023 17.3356H1.87431C1.48824 17.3718 1.0999 17.296 0.755889 17.117C0.730508 17.2393 0.733969 17.3658 0.765998 17.4864C0.798026 17.6071 0.857741 17.7187 0.940404 17.8123C1.02307 17.9058 1.1264 17.9789 1.24221 18.0255C1.35802 18.0722 1.48311 18.0913 1.60756 18.0812H17.198C17.3233 18.0903 17.449 18.0705 17.5654 18.0233C17.6818 17.976 17.7858 17.9027 17.8694 17.8089C17.953 17.7151 18.0138 17.6033 18.0473 17.4822C18.0808 17.3612 18.086 17.234 18.0625 17.1106H18.0722ZM3.6098 2.20149C3.6098 1.88011 3.6098 1.55872 3.6098 1.23734C3.615 1.17657 3.60753 1.11538 3.58785 1.05766C3.56816 0.999934 3.5367 0.946927 3.49546 0.901999C3.45421 0.85707 3.40409 0.8212 3.34825 0.796663C3.29242 0.772125 3.23209 0.759454 3.1711 0.759454C3.11012 0.759454 3.04979 0.772125 2.99396 0.796663C2.93812 0.8212 2.88799 0.85707 2.84675 0.901999C2.80551 0.946927 2.77405 0.999934 2.75436 1.05766C2.73468 1.11538 2.72721 1.17657 2.73241 1.23734C2.73241 1.88011 2.73241 2.52288 2.73241 3.18493C2.72721 3.2457 2.73468 3.30689 2.75436 3.36461C2.77405 3.42234 2.80551 3.47534 2.84675 3.52027C2.88799 3.5652 2.93812 3.60107 2.99396 3.62561C3.04979 3.65015 3.11012 3.66282 3.1711 3.66282C3.23209 3.66282 3.29242 3.65015 3.34825 3.62561C3.40409 3.60107 3.45421 3.5652 3.49546 3.52027C3.5367 3.47534 3.56816 3.42234 3.58785 3.36461C3.60753 3.30689 3.615 3.2457 3.6098 3.18493C3.60015 2.85069 3.59694 2.52609 3.59694 2.20149H3.6098ZM16.0989 2.22078C16.0989 1.89939 16.0989 1.54908 16.0989 1.21162C16.1041 1.15086 16.0966 1.08967 16.0769 1.03195C16.0572 0.974223 16.0258 0.921216 15.9845 0.876288C15.9433 0.831359 15.8931 0.795489 15.8373 0.770952C15.7815 0.746414 15.7212 0.733743 15.6602 0.733743C15.5992 0.733743 15.5388 0.746414 15.483 0.770952C15.4272 0.795489 15.3771 0.831359 15.3358 0.876288C15.2946 0.921216 15.2631 0.974223 15.2434 1.03195C15.2237 1.08967 15.2163 1.15086 15.2215 1.21162C15.2215 1.87368 15.2215 2.53466 15.2215 3.19458C15.2163 3.25534 15.2237 3.31653 15.2434 3.37425C15.2631 3.43198 15.2946 3.48499 15.3358 3.52991C15.3771 3.57484 15.4272 3.61071 15.483 3.63525C15.5388 3.65979 15.5992 3.67246 15.6602 3.67246C15.7212 3.67246 15.7815 3.65979 15.8373 3.63525C15.8931 3.61071 15.9433 3.57484 15.9845 3.52991C16.0258 3.48499 16.0572 3.43198 16.0769 3.37425C16.0966 3.31653 16.1041 3.25534 16.0989 3.19458C16.0892 2.86998 16.086 2.54538 16.086 2.22078H16.0989ZM9.85754 2.22078C9.85754 1.89939 9.85754 1.55872 9.85754 1.22769C9.86275 1.16693 9.85527 1.10574 9.83559 1.04802C9.81591 0.990292 9.78445 0.937285 9.7432 0.892357C9.70196 0.847429 9.65183 0.811559 9.59599 0.787021C9.54016 0.762483 9.47984 0.749813 9.41885 0.749813C9.35786 0.749813 9.29754 0.762483 9.2417 0.787021C9.18587 0.811559 9.13574 0.847429 9.09449 0.892357C9.05325 0.937285 9.02179 0.990292 9.00211 1.04802C8.98243 1.10574 8.97495 1.16693 8.98016 1.22769C8.98016 1.88975 8.98016 2.54859 8.98016 3.21065C8.97495 3.27141 8.98243 3.3326 9.00211 3.39032C9.02179 3.44805 9.05325 3.50105 9.09449 3.54598C9.13574 3.59091 9.18587 3.62678 9.2417 3.65132C9.29754 3.67586 9.35786 3.68853 9.41885 3.68853C9.47984 3.68853 9.54016 3.67586 9.59599 3.65132C9.65183 3.62678 9.70196 3.59091 9.7432 3.54598C9.78445 3.50105 9.81591 3.44805 9.83559 3.39032C9.85527 3.3326 9.86275 3.27141 9.85754 3.21065C9.8479 2.86355 9.84468 2.53574 9.84468 2.20471L9.85754 2.22078Z" fill="#354999"/><path d="M11.0371 15.1052C10.897 15.0657 10.7596 15.0174 10.6257 14.9606C10.2625 14.7774 9.89936 14.5845 9.53941 14.3885C9.49924 14.3623 9.45235 14.3484 9.40442 14.3484C9.3565 14.3484 9.30961 14.3623 9.26944 14.3885C8.92877 14.5781 8.57846 14.7517 8.23458 14.9381C8.09075 15.0327 7.92163 15.0815 7.74951 15.078C7.57739 15.0746 7.41035 15.0191 7.27042 14.9188C7.12967 14.8195 7.02318 14.679 6.96562 14.5167C6.90806 14.3544 6.90226 14.1782 6.94904 14.0125C7.02617 13.6172 7.09045 13.2186 7.14829 12.8201C7.1515 12.7808 7.14691 12.7413 7.13477 12.7038C7.12264 12.6663 7.10321 12.6315 7.07759 12.6016C6.79477 12.3123 6.50552 12.0327 6.21306 11.7531C6.08217 11.644 5.98704 11.4981 5.93996 11.3343C5.89288 11.1705 5.89602 10.9964 5.94898 10.8344C6.00193 10.6724 6.10227 10.53 6.23701 10.4257C6.37175 10.3213 6.5347 10.2598 6.70478 10.249C7.1033 10.1976 7.50182 10.1366 7.90034 10.0691C7.93879 10.06 7.97506 10.0434 8.00705 10.0202C8.03905 9.99706 8.06613 9.96778 8.08674 9.93408C8.27636 9.57091 8.45634 9.20453 8.6331 8.83494C8.69722 8.67971 8.80597 8.54701 8.94557 8.45364C9.08516 8.36027 9.24933 8.31042 9.41728 8.31042C9.58523 8.31042 9.74939 8.36027 9.88899 8.45364C10.0286 8.54701 10.1373 8.67971 10.2015 8.83494C10.3782 9.20132 10.5582 9.57091 10.7478 9.93408C10.7912 10.0005 10.8576 10.0486 10.9342 10.0691C11.352 10.1398 11.7698 10.1944 12.1844 10.2555C12.3443 10.2705 12.4962 10.3325 12.6209 10.4338C12.7456 10.535 12.8375 10.6709 12.885 10.8243C12.9416 10.975 12.9517 11.1392 12.9138 11.2956C12.876 11.452 12.7921 11.5935 12.6729 11.7017C12.3708 12.0038 12.0591 12.2963 11.757 12.6016C11.7064 12.6626 11.6821 12.7412 11.6895 12.8201C11.7505 13.2411 11.8309 13.6622 11.8984 14.0864C11.92 14.2117 11.9138 14.3402 11.8805 14.4629C11.8471 14.5856 11.7873 14.6994 11.7052 14.7965C11.6231 14.8936 11.5207 14.9716 11.4053 15.0249C11.2899 15.0782 11.1642 15.1056 11.0371 15.1052ZM7.64644 14.2085C7.64644 14.3242 7.71715 14.366 7.86499 14.2889C8.29564 14.0671 8.72309 13.8453 9.15053 13.6139C9.22825 13.5659 9.31785 13.5404 9.40924 13.5404C9.50064 13.5404 9.59023 13.5659 9.66796 13.6139C10.0965 13.8411 10.5186 14.0628 10.9342 14.2792C10.9614 14.2957 10.9918 14.3062 11.0234 14.3101C11.055 14.314 11.087 14.3111 11.1174 14.3017C11.1528 14.276 11.1592 14.1828 11.1495 14.1249C11.0724 13.6397 10.9953 13.1608 10.9053 12.6787C10.8873 12.598 10.8919 12.514 10.9185 12.4357C10.9452 12.3575 10.9929 12.2881 11.0563 12.2352C11.4034 11.9138 11.7505 11.5603 12.0912 11.2196C12.1362 11.1778 12.1844 11.1007 12.1716 11.0589C12.1587 11.0171 12.0719 10.9786 12.0141 10.9689C11.5513 10.895 11.0853 10.8211 10.616 10.7633C10.5187 10.7579 10.4249 10.7248 10.3457 10.6678C10.2666 10.6109 10.2054 10.5325 10.1693 10.4419C9.97006 10.0144 9.75795 9.59341 9.54583 9.17561C9.50906 9.12328 9.46587 9.07577 9.41728 9.0342C9.36199 9.07462 9.31228 9.12217 9.26944 9.17561C9.05411 9.60305 8.842 10.0273 8.62667 10.4611C8.59157 10.5457 8.53357 10.6188 8.45919 10.6722C8.3848 10.7255 8.297 10.7571 8.20565 10.7633C7.74929 10.8211 7.29613 10.8854 6.84298 10.9593C6.76543 10.981 6.69171 11.0146 6.62444 11.0589C6.65843 11.1269 6.70052 11.1906 6.74978 11.2485C7.07116 11.5699 7.42147 11.9106 7.76214 12.2352C7.82393 12.2901 7.87015 12.3602 7.89611 12.4387C7.92207 12.5171 7.92685 12.601 7.90998 12.6819C7.81678 13.1769 7.73643 13.6814 7.64644 14.2085Z" fill="#354999"/><path d="M9.40763 7.05119C9.33477 7.05246 9.26319 7.03198 9.20202 6.99236C9.14086 6.95275 9.09291 6.89579 9.06428 6.82878C9.03566 6.76176 9.02767 6.68774 9.04134 6.61616C9.055 6.54458 9.0897 6.4787 9.141 6.42695C9.1923 6.37519 9.25786 6.33991 9.32932 6.32561C9.40077 6.31131 9.47486 6.31864 9.54213 6.34666C9.6094 6.37469 9.66677 6.42214 9.70693 6.48295C9.74709 6.54375 9.76821 6.61515 9.76758 6.68802C9.76596 6.78328 9.72761 6.87423 9.66054 6.94189C9.59348 7.00956 9.50287 7.04871 9.40763 7.05119Z" fill="#354999"/></svg>`}
        />

        <Text
          style={{
            fontFamily: "MuseoSans_500",
            fontSize: 20,
            textAlign: "center",
            color: "#354999",
          }}
        >
          {wordsLanguage[actualLanguage][2]}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <TextInput
          style={{
            backgroundColor: "#f2f2f2",
            paddingHorizontal: 15,
            flex: 1,
            borderTopLeftRadius: 25,
            borderBottomLeftRadius: 25,
          }}
          placeholder="Buscar..."
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
        />

        <Pressable
          style={{
            alignItems: "center",
            backgroundColor: "#354999",
            flexDirection: "row",
            justifyContent: "center",
            gap: 15,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderTopRightRadius: 25,
            borderBottomRightRadius: 25,
          }}
          onPress={() => {
            openModal();
          }}
        >
          <FontAwesome name="filter" size={20} color="#FFF" />
        </Pressable>
      </View>
      {agendas.length > 1 && (
        <FlatList
          ref={flatListRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          horizontal
          style={{ backgroundColor: "#F1F1F1", height: 80, marginBottom: 10 }}
          data={agendas}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={async () => {
                setQueriesCompleted(false);
                setActiveIndex(index);
                setActiveAgenda(item.tid);
                scrollToTop();
                setQueriesCompleted(true);
              }}
              style={{
                backgroundColor:
                  activeIndex == index ? Colors.orange : "transparent",
                marginLeft: 20,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 14,
                  color: activeIndex == index ? "#FFF" : Colors.orange,
                  fontFamily: "MuseoSans_500",
                  textAlignVertical: "center",
                }}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      )}
      <FlatList
        contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 20 }}
        style={{ height: windowHeight - 130 }}
        ItemSeparatorComponent={() => <View style={{ marginVertical: 10 }} />}
        data={filteredData} // Usa los datos filtrados
        extraData={filteredData}
        renderItem={({ item }) => (
          <CardEvento
            isHorizontal
            onPress={() => router.push(`(tabs)/events/${item.nid}`)}
            title={item.title}
            place={item.field_place}
            start={item.field_date}
            end={item.field_end_date}
            image={`https://files.visitbogota.co${
              item.field_imagen_listado_events
                ? item.field_imagen_listado_events
                : "/img/noimg.png"
            }`}
          />
        )}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    alignItems: "center",
    backgroundColor: "#354999", // Color de fondo azul oscuro
    flexDirection: "row",
    justifyContent: "center",
    gap: 15, // Espaciado entre los elementos dentro del botón
    paddingVertical: 12, // Ajuste en el padding para mejorar la apariencia
    paddingHorizontal: 25,
    borderRadius: 30, // Bordes redondeados más suaves
    shadowColor: "#000", // Sombra para dar un efecto flotante
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevación para Android
    marginVertical: 10, // Espaciado entre los botones y otros elementos
  },
  btnText: {
    color: "white", // Texto blanco para contraste
    fontSize: 16, // Tamaño de texto más grande para mejorar la legibilidad
    fontWeight: "600", // Negrita para resaltar el texto
    fontFamily: "System", // Usa una fuente del sistema, o personaliza con una específica si lo deseas
  },
  dateButton: {
    alignItems: "center",
    backgroundColor: "#FFF", // Color de fondo azul oscuro
    flexDirection: "row",
    borderColor: "#354999",
    borderWidth: 1,
    justifyContent: "center",
    gap: 15, // Espaciado entre los elementos dentro del botón
    paddingVertical: 12, // Ajuste en el padding para mejorar la apariencia
    paddingHorizontal: 25,
    borderRadius: 30, // Bordes redondeados más suaves
    shadowColor: "#000", // Sombra para dar un efecto flotante
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevación para Android
    marginVertical: 10, // Espaciado entre los botones y otros elementos
  },
  dateButtonText: {
    color: "#354999", // Texto blanco para contraste
    fontSize: 16, // Tamaño de texto más grande para mejorar la legibilidad
    fontWeight: "600", // Negrita para resaltar el texto
    fontFamily: "System", // Usa una fuente del sistema, o personaliza con una específica si lo deseas
  },
});

export default EventsList;
