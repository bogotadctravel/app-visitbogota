import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Button,
  TextInput,
  Image,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilters, fetchAllPLanes } from "../../../src/store/actions";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import {
  CustomCheckbox,
  HorizontalFlatListWithRows,
  PreloaderComponent,
} from "../../../src/components";
import { router } from "expo-router";
import { windowHeight, windowWidth } from "../../../src/constants/ScreenWidth";
import { Colors } from "../../../src/constants";
import {
  selectActualLanguage,
  selectPlanesData,
  selectPlanesFilterData,
  selectWordsLang,
} from "../../../src/store/selectors";
import {
  fetchBogotaDrplV2,
  number_format,
  truncateString,
} from "../../../src/api/imperdibles";
import Slider from "@react-native-community/slider";
import IconSvg from "../../../src/components/IconSvg";
import { LinearGradient } from "expo-linear-gradient";

const CustomModal = ({
  visible,
  filtrarPlanes,
  closeModal,
  cantidadPersonas,
  planesData,
  setCantidadPersonas,
  test_zona,
  setTest_zona,
  zonas_gastronomicas,
  setZonas_gastronomicas,
  limpiarFiltros,
}) => {
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const filtersData = useSelector(selectPlanesFilterData);
  const getTitleByIndex = (index) => {
    switch (index) {
      case 0:
        return wordsLanguage[actualLanguage][33];
      case 1:
        return wordsLanguage[actualLanguage][34];
      case 2:
        return wordsLanguage[actualLanguage][35];
      case 3:
        return wordsLanguage[actualLanguage][36];
      default:
        return "";
    }
  };

  let persons = [
    {
      name: "1 persona",
      tid: 1,
    },
    {
      name: " 2 personas",
      tid: 2,
    },
    {
      name: "3 personas",
      tid: 3,
    },
    {
      name: "4 personas",
      tid: 4,
    },
    {
      name: "Grupos",
      tid: "all",
    },
  ];
  const getAvailableCategoryIds = (planesData) => {
    const availableCategoryIds = new Set();

    planesData.forEach((plan) => {
      if (plan.field_nueva_categorizacion_1) {
        const categories = plan.field_nueva_categorizacion_1
          .split(",")
          .map((cat) => cat.trim());
        categories.forEach((categoryId) =>
          availableCategoryIds.add(categoryId)
        );
      }
    });
    return Array.from(availableCategoryIds);
  };
  const getAvailableZonasIds = (planesData) => {
    const availableZonasIds = new Set();

    planesData.forEach((plan) => {
      if (plan.field_pb_oferta_zona) {
        const categories = plan.field_pb_oferta_zona
          .split(",")
          .map((cat) => cat.trim());
        categories.forEach((zoneId) => availableZonasIds.add(zoneId));
      }
    });
    return Array.from(availableZonasIds);
  };
  const getAvailablePersons = (planesData) => {
    const availablePersons = new Set();

    planesData.forEach((plan) => {
      const maxPeople = parseInt(plan.field_maxpeople, 10);

      if (maxPeople) {
        // Validar contra las opciones disponibles
        if (maxPeople == 1) availablePersons.add(1); // Incluye la opción de 1 persona
        if (maxPeople == 2) availablePersons.add(2); // Incluye la opción de 2 personas
        if (maxPeople == 3) availablePersons.add(3); // Incluye la opción de 3 personas
        if (maxPeople == 4) availablePersons.add(4); // Incluye la opción de 4 personas

        // Si el número es mayor a 4, incluye la opción de "Grupos" (tid: 'all')
        if (maxPeople > 4) availablePersons.add("all");
      }
    });

    return Array.from(availablePersons);
  };

  // Obtener las opciones disponibles para el número de personas
  const availablePersons = getAvailablePersons(planesData);
  const availableCategoryIds = getAvailableCategoryIds(planesData);
  const availableZonasIds = getAvailableZonasIds(planesData);

  return (
    <Modal
      visible={visible}
      onRequestClose={closeModal}
      animationType="slide"
      transparent
    >
      <View
        style={{
          alignItems: "center",
          paddingVertical: 50,
          flex: 1,
          backgroundColor: "rgba(255,255,255,.9)",
        }}
      >
        <Pressable
          style={{ marginBottom: 30 }}
          onPress={() => closeModal(false)}
        >
          <FontAwesome name="close" size={30} color="#354999" />
        </Pressable>
        <ScrollView>
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <Text style={stylesModal.titleFilter}>{getTitleByIndex(0)}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {persons.map((item) => {
                // Verificar si el filtro está en las opciones disponibles
                if (!availablePersons.includes(item.tid)) {
                  return null;
                }

                const isChecked =
                  Array.isArray(cantidadPersonas) &&
                  cantidadPersonas.includes(item.tid);

                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setCantidadPersonas((prevState) => {
                          return isChecked
                            ? prevState.filter((id) => id !== item.tid) // Desmarca el checkbox
                            : [...prevState, item.tid];
                        });
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <Text style={stylesModal.titleFilter}>{getTitleByIndex(1)}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {filtersData[1].map((item, index) => {
                if (!availableCategoryIds.includes(item.tid.toString())) {
                  return null;
                }

                const isChecked =
                  Array.isArray(test_zona) && test_zona.includes(item.tid);

                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setTest_zona((prevState) => {
                          return isChecked
                            ? prevState.filter((id) => id !== item.tid) // Desmarca el checkbox
                            : [...prevState, item.tid];
                        });
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <Text style={stylesModal.titleFilter}>{getTitleByIndex(2)}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {filtersData[0].map((item, index) => {
                if (!availableZonasIds.includes(item.tid.toString())) {
                  return null;
                }

                const isChecked =
                  Array.isArray(zonas_gastronomicas) &&
                  zonas_gastronomicas.includes(item.tid);

                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setZonas_gastronomicas((prevState) => {
                          return isChecked
                            ? prevState.filter((id) => id !== item.tid) // Desmarca el checkbox
                            : [...prevState, item.tid];
                        });
                      }}
                    />
                  </View>
                );
              })}
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Button
              color="#354999"
              title={wordsLanguage[actualLanguage][27]}
              onPress={() =>
                filtrarPlanes({
                  cantidadPersonas,
                  test_zona,
                  zonas_gastronomicas,
                })
              }
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Button
              color="#354999"
              title={wordsLanguage[actualLanguage][28]}
              onPress={limpiarFiltros}
            />
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
    paddingVertical: 15,
  },
});

const EventsList = () => {
  // NUEVO
  const dispatch = useDispatch();
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const planesData = useSelector(selectPlanesData);
  const [queriesCompleted, setQueriesCompleted] = useState(false);
  const [filterModal, setFilterModal] = useState(false);

  const [cantidadPersonas, setCantidadPersonas] = useState([]);
  const [test_zona, setTest_zona] = useState([]);
  const [zonas_gastronomicas, setZonas_gastronomicas] = useState([]);
  const [rangos_de_precio, setRangos_de_precio] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [availablePersons, setAvailablePersons] = useState([]);
  const [restaurantArrayData, setRestaurantArrayData] = useState([]);

  useEffect(() => {
    const loadAll = async () => {
      await dispatch(
        fetchAllFilters(["test_zona", "categorias_atractivos_2024"], "planes")
      );

      await dispatch(fetchAllPLanes());

      setQueriesCompleted(true);
    };

    loadAll();
  }, [actualLanguage, dispatch]);

  // Funciones para obtener filtros
  const getAvailableCategoryIds = (planes) => {
    const categories = new Set();
    planes.forEach((plan) => {
      if (plan.field_nueva_categorizacion_1) {
        plan.field_nueva_categorizacion_1
          .split(",")
          .map((cat) => cat.trim())
          .forEach((categoryId) => categories.add(categoryId));
      }
    });
    return Array.from(categories);
  };

  const getAvailableZonasIds = (planes) => {
    const zonas = new Set();
    planes.forEach((plan) => {
      if (plan.field_pb_oferta_zona) {
        plan.field_pb_oferta_zona
          .split(",")
          .map((zona) => zona.trim())
          .forEach((zonaId) => zonas.add(zonaId));
      }
    });
    return Array.from(zonas);
  };

  const getAvailablePersons = (planes) => {
    const persons = new Set();
    planes.forEach((plan) => {
      const maxPeople = parseInt(plan.field_maxpeople, 10);
      if (maxPeople) {
        if (maxPeople >= 1) persons.add(1);
        if (maxPeople >= 2) persons.add(2);
        if (maxPeople >= 3) persons.add(3);
        if (maxPeople >= 4) persons.add(4);
        if (maxPeople > 4) persons.add("all");
      }
    });
    return Array.from(persons);
  };

  // Función para actualizar los filtros
  const updateFilters = (planes) => {
    setCategorias(getAvailableCategoryIds(planes));
    setZonas(getAvailableZonasIds(planes));
    setAvailablePersons(getAvailablePersons(planes));
  };

  useEffect(() => {
    setRestaurantArrayData(planesData);
    updateFilters(planesData);
  }, [planesData, actualLanguage]);

  const filtrarPlanes = async (data) => {
    setQueriesCompleted(false);
    const { cantidadPersonas, test_zona, zonas_gastronomicas } = data || {};
    const categoriasIsEmpty = test_zona.length === 0;
    const zonasIsEmpty = zonas_gastronomicas.length === 0;
    const cantidadIsEmpty = cantidadPersonas.length === 0;

    const url = `/all_ofertas/all/${
      zonasIsEmpty ? "all" : zonas_gastronomicas.join("+")
    }/${cantidadIsEmpty ? "all" : cantidadPersonas.join("+")}/${
      categoriasIsEmpty ? "all" : test_zona.join("+")
    }/${searchValue === "" ? "all" : searchValue}`;

    const newData = await fetchBogotaDrplV2(url, actualLanguage);
    const uniqueData = [
      ...new Map(newData.map((item) => [item.nid, item])).values(),
    ];

    setRestaurantArrayData(uniqueData);
    updateFilters(uniqueData); // Actualizar filtros con los nuevos datos filtrados
    setQueriesCompleted(true);
    closeModal();
  };

  const openModal = () => setFilterModal(true);
  const closeModal = () => setFilterModal(false);

  const limpiarFiltros = () => {
    setCantidadPersonas([]);
    setTest_zona([]);
    setZonas_gastronomicas([]);
    setRangos_de_precio(0);
    setRestaurantArrayData(planesData);
    updateFilters(planesData); // Restablece los filtros
    setSearchValue("");
    closeModal();
  };
  // ANTIGUO

  React.useEffect(() => {
    async function fetchData() {
      await dispatch(fetchAllPLanes());
      setQueriesCompleted(true);
    }
    async function getFilters() {
      dispatch(
        fetchAllFilters(["test_zona", "categorias_atractivos_2024"], "planes")
      );
    }
    getFilters();
    fetchData();
  }, [dispatch, actualLanguage]);

  React.useEffect(() => {
    setRestaurantArrayData(planesData);
  }, [planesData, actualLanguage]);

  if (!queriesCompleted) {
    return <PreloaderComponent planBogota />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground>
        <ScrollView
          style={{ height: windowHeight - 150 }}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <CustomModal
            visible={filterModal}
            closeModal={closeModal}
            filtrarPlanes={filtrarPlanes}
            limpiarFiltros={limpiarFiltros}
            cantidadPersonas={cantidadPersonas}
            setCantidadPersonas={setCantidadPersonas}
            test_zona={test_zona}
            setTest_zona={setTest_zona}
            categorias={categorias}
            zonas={zonas}
            planesData={restaurantArrayData}
            zonas_gastronomicas={zonas_gastronomicas}
            setZonas_gastronomicas={setZonas_gastronomicas}
            rangos_de_precio={rangos_de_precio}
            setRangos_de_precio={setRangos_de_precio}
            availablePersons={availablePersons}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <IconSvg
              width="25"
              height="25"
              icon={`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5256 17.3142C1.38718 17.275 1.24575 17.2419 1.11034 17.1908C0.788789 17.0746 0.510271 16.8632 0.311902 16.5847C0.113533 16.3063 0.0047333 15.974 0 15.6321C0 12.8136 0 10.0001 0 7.19166C0.00553427 6.74574 0.186365 6.31992 0.503388 6.00627C0.820411 5.69263 1.24815 5.51637 1.6941 5.51562C1.97996 5.51562 2.26883 5.51562 2.57275 5.51562C2.57275 5.36516 2.57275 5.23276 2.57275 5.09736C2.57275 4.77414 2.70114 4.46417 2.92969 4.23563C3.15824 4.00708 3.46821 3.87868 3.79142 3.87868C4.11463 3.87868 4.42461 4.00708 4.65315 4.23563C4.8817 4.46417 5.01009 4.77414 5.01009 5.09736C5.01009 5.23276 5.01009 5.36817 5.01009 5.51862H5.78342C6.12345 5.51862 6.46046 5.51862 6.80048 5.51862C6.84686 5.52298 6.89344 5.51288 6.93384 5.48972C6.97425 5.46655 7.0065 5.43145 7.02616 5.38923C7.37522 4.78742 7.7363 4.18561 8.08836 3.5838C8.1262 3.50832 8.18555 3.44575 8.25892 3.40398C8.33229 3.36221 8.41639 3.34311 8.50061 3.34909H13.0443C13.1313 3.34266 13.2182 3.36244 13.2938 3.40588C13.3694 3.44933 13.4303 3.51444 13.4686 3.59282C13.8146 4.19464 14.1757 4.79645 14.5217 5.39826C14.5431 5.44281 14.5777 5.4797 14.6208 5.50392C14.6638 5.52815 14.7133 5.53853 14.7625 5.53367C15.1459 5.51654 15.53 5.52659 15.9119 5.56376C16.2642 5.61331 16.5914 5.77446 16.8454 6.02358C17.0994 6.27269 17.2668 6.59666 17.3232 6.94793C17.3306 6.97495 17.3406 7.00116 17.3533 7.02617V15.8247C17.3533 15.8608 17.3262 15.8969 17.3172 15.933C17.2559 16.2363 17.1136 16.5174 16.9054 16.7462C16.6972 16.9751 16.4308 17.1433 16.1346 17.2329C16.0353 17.269 15.93 17.2871 15.8337 17.3142H1.5256ZM8.68416 6.19867H1.80544C1.65414 6.1858 1.50186 6.20618 1.35928 6.25838C1.21669 6.31058 1.08725 6.39334 0.980023 6.50085C0.872798 6.60836 0.790387 6.73803 0.738568 6.88075C0.686749 7.02348 0.666776 7.17581 0.680048 7.32707V15.4937C0.667031 15.6454 0.687083 15.7982 0.738821 15.9414C0.790559 16.0847 0.872753 16.215 0.979733 16.3234C1.08671 16.4318 1.21594 16.5158 1.35849 16.5694C1.50104 16.623 1.65353 16.6451 1.80544 16.6341H15.5268C15.6798 16.6471 15.8338 16.6263 15.978 16.5733C16.1221 16.5203 16.2529 16.4364 16.361 16.3273C16.4692 16.2183 16.5521 16.0869 16.604 15.9423C16.6559 15.7978 16.6754 15.6436 16.6612 15.4907C16.6612 12.7825 16.6612 10.0563 16.6612 7.34212C16.6676 7.18907 16.6421 7.03636 16.5865 6.89365C16.5308 6.75094 16.4461 6.62133 16.3378 6.51302C16.2295 6.4047 16.0999 6.32004 15.9572 6.26438C15.8145 6.20872 15.6618 6.18327 15.5087 6.18965C13.2399 6.2077 10.965 6.19867 8.68416 6.19867ZM13.7996 5.51261C13.4987 5.02213 13.2369 4.55572 12.957 4.09233C12.9366 4.07197 12.9121 4.0561 12.8851 4.04574C12.8582 4.03538 12.8294 4.03075 12.8006 4.03215H8.73531C8.69418 4.02904 8.65308 4.03863 8.61757 4.05961C8.58206 4.0806 8.55384 4.11197 8.53671 4.1495C8.35617 4.46545 8.1666 4.7814 7.98004 5.09736L7.73329 5.51862L13.7996 5.51261ZM4.32703 5.51261C4.32703 5.35613 4.32703 5.2117 4.32703 5.07328C4.32078 4.93937 4.2648 4.8126 4.17006 4.71776C4.07531 4.62291 3.9486 4.56681 3.81469 4.56042C3.68078 4.55402 3.5493 4.59779 3.44595 4.68318C3.34259 4.76856 3.2748 4.88942 3.25581 5.02213C3.24524 5.18545 3.24524 5.34928 3.25581 5.51261H4.32703Z" fill="#354999"/><path d="M11.1156 1.21566C11.1156 1.51657 11.1156 1.79039 11.1156 2.07926C11.12 2.1264 11.1146 2.17395 11.0996 2.21886C11.0846 2.26377 11.0604 2.30506 11.0285 2.34007C10.9966 2.37509 10.9578 2.40306 10.9145 2.42221C10.8712 2.44135 10.8244 2.45124 10.777 2.45124C10.7297 2.45124 10.6829 2.44135 10.6396 2.42221C10.5963 2.40306 10.5574 2.37509 10.5256 2.34007C10.4937 2.30506 10.4695 2.26377 10.4545 2.21886C10.4395 2.17395 10.4341 2.1264 10.4385 2.07926C10.4385 1.49851 10.4385 0.917764 10.4385 0.337015C10.4385 0.247633 10.474 0.161912 10.5372 0.0987095C10.6004 0.0355069 10.6862 0 10.7755 0C10.8649 0 10.9506 0.0355069 11.0138 0.0987095C11.077 0.161912 11.1125 0.247633 11.1125 0.337015C11.1336 0.628894 11.1156 0.923783 11.1156 1.21566Z" fill="#354999"/><path d="M9.49961 2.05223C9.51195 2.12605 9.49981 2.20188 9.46504 2.26816C9.43027 2.33444 9.37478 2.38753 9.30703 2.41933C9.24368 2.45194 9.17138 2.46283 9.10125 2.45032C9.03111 2.43782 8.96703 2.40261 8.91886 2.35012L8.22376 1.65503L7.70921 1.14048C7.67433 1.10986 7.64608 1.07241 7.62621 1.03045C7.60635 0.988497 7.59528 0.942917 7.5937 0.896521C7.59212 0.850126 7.60006 0.803898 7.61702 0.760687C7.63399 0.717476 7.65962 0.678196 7.69234 0.645268C7.72507 0.612339 7.76418 0.58646 7.80729 0.569225C7.85039 0.55199 7.89657 0.543764 7.94297 0.545053C7.98938 0.546342 8.03503 0.55712 8.07711 0.576722C8.11919 0.596325 8.15681 0.624336 8.18765 0.65903C8.58786 1.05623 8.98806 1.45342 9.39128 1.86266C9.43359 1.92209 9.46988 1.9856 9.49961 2.05223Z" fill="#354999"/><path d="M13.968 0.947861C13.9343 1.01719 13.8918 1.08191 13.8417 1.14044C13.4535 1.54065 13.0563 1.93483 12.6591 2.32601C12.6302 2.36467 12.5933 2.39671 12.551 2.42002C12.5087 2.44333 12.462 2.45736 12.4138 2.46118C12.3657 2.46501 12.3173 2.45853 12.2718 2.44219C12.2264 2.42586 12.185 2.40002 12.1503 2.36642C12.1156 2.33282 12.0885 2.29222 12.0707 2.24732C12.053 2.20241 12.045 2.15424 12.0473 2.10601C12.0496 2.05778 12.0621 2.01059 12.0841 1.96758C12.106 1.92458 12.1369 1.88674 12.1746 1.8566C12.5718 1.45338 12.972 1.05619 13.3783 0.652972C13.4254 0.59824 13.4893 0.560607 13.56 0.545916C13.6308 0.531225 13.7044 0.540299 13.7694 0.571728C13.9079 0.6289 13.971 0.743244 13.968 0.947861Z" fill="#354999"/><path d="M10.7754 7.14954C11.6289 7.14906 12.4629 7.40476 13.1696 7.88355C13.8762 8.36234 14.4228 9.04218 14.7387 9.8351C15.0547 10.628 15.1254 11.4975 14.9417 12.331C14.758 13.1646 14.3283 13.9238 13.7084 14.5105C13.0884 15.0971 12.3066 15.4842 11.4642 15.6216C10.6218 15.759 9.75755 15.6404 8.98328 15.2812C8.20901 14.922 7.56037 14.3387 7.12131 13.6067C6.68224 12.8748 6.47296 12.0279 6.52055 11.1757C6.56923 10.7423 6.66096 10.315 6.79437 9.89982C6.87261 9.61396 7.05917 9.51767 7.2668 9.59891C7.47442 9.68016 7.52257 9.8607 7.42628 10.1375C7.18184 10.738 7.11146 11.3952 7.22322 12.0338C7.33498 12.6724 7.62435 13.2666 8.05818 13.7484C8.48681 14.29 9.07083 14.6875 9.73186 14.8875C10.3929 15.0876 11.0993 15.0807 11.7563 14.8678C12.4273 14.7016 13.032 14.3356 13.4904 13.8181C13.9487 13.3007 14.2391 12.6562 14.3231 11.9701C14.4188 11.35 14.3506 10.7158 14.1252 10.1303C13.8997 9.54486 13.5249 9.02865 13.038 8.63304C12.5511 8.23743 11.969 7.97621 11.3498 7.87537C10.7306 7.77453 10.0958 7.83759 9.50855 8.05827L9.38217 8.10642C9.34031 8.12289 9.2956 8.13089 9.25062 8.12996C9.20565 8.12903 9.1613 8.11918 9.12016 8.10099C9.07902 8.08279 9.0419 8.05662 9.01094 8.02398C8.97999 7.99134 8.95582 7.95288 8.93984 7.91083C8.92331 7.86826 8.91569 7.82276 8.91745 7.77714C8.9192 7.73151 8.93029 7.68673 8.95003 7.64556C8.96977 7.60439 8.99774 7.5677 9.03221 7.53776C9.06669 7.50783 9.10694 7.48528 9.15047 7.47151C9.60542 7.28766 10.0893 7.18579 10.5798 7.1706L10.7754 7.14954Z" fill="#354999"/><path d="M13.5559 11.4043C13.5565 11.9545 13.3938 12.4925 13.0885 12.9501C12.7833 13.4078 12.3491 13.7647 11.8409 13.9755C11.3327 14.1863 10.7734 14.2416 10.2338 14.1344C9.69419 14.0272 9.19849 13.7624 8.80947 13.3734C8.42045 12.9843 8.15558 12.4886 8.0484 11.949C7.94121 11.4094 7.99652 10.8501 8.20734 10.3419C8.41815 9.83377 8.77498 9.39956 9.23268 9.09428C9.69037 8.789 10.2283 8.62636 10.7785 8.62695C11.5144 8.62933 12.2194 8.92271 12.7398 9.44306C13.2601 9.9634 13.5535 10.6684 13.5559 11.4043ZM10.7815 9.29798C10.3649 9.29798 9.95767 9.42151 9.61129 9.65296C9.2649 9.88441 8.99493 10.2134 8.8355 10.5983C8.67608 10.9831 8.63436 11.4067 8.71564 11.8152C8.79691 12.2238 8.99752 12.5992 9.2921 12.8937C9.58668 13.1883 9.96199 13.3889 10.3706 13.4702C10.7792 13.5515 11.2027 13.5098 11.5876 13.3503C11.9725 13.1909 12.3014 12.9209 12.5329 12.5745C12.7643 12.2282 12.8879 11.8209 12.8879 11.4043C12.8831 10.8488 12.6591 10.3177 12.2646 9.92657C11.8701 9.53545 11.337 9.31601 10.7815 9.31603V9.29798Z" fill="#354999"/><path d="M3.79742 8.29895H4.64297C4.68723 8.29796 4.73125 8.3057 4.77251 8.32172C4.81378 8.33775 4.85149 8.36174 4.88348 8.39234C4.91547 8.42294 4.94113 8.45953 4.95898 8.50004C4.97682 8.54055 4.98652 8.58418 4.98751 8.62844C4.9885 8.6727 4.98076 8.71672 4.96473 8.75798C4.94871 8.79925 4.92471 8.83696 4.89412 8.86895C4.86352 8.90094 4.82692 8.9266 4.78641 8.94445C4.7459 8.9623 4.70227 8.97199 4.65802 8.97298C4.08429 8.97298 3.50956 8.97298 2.93382 8.97298C2.88956 8.97179 2.84597 8.9619 2.80554 8.94387C2.7651 8.92584 2.72862 8.90002 2.69816 8.86789C2.6677 8.83575 2.64387 8.79794 2.62803 8.75659C2.61219 8.71525 2.60465 8.67119 2.60583 8.62694C2.60702 8.58268 2.61691 8.53909 2.63494 8.49865C2.65297 8.45822 2.67879 8.42173 2.71093 8.39128C2.74306 8.36082 2.78088 8.33699 2.82222 8.32115C2.86356 8.30531 2.90762 8.29776 2.95188 8.29895H3.79742Z" fill="#354999"/><path d="M8.33516 8.62998C8.33516 8.67424 8.32645 8.71807 8.30951 8.75895C8.29257 8.79984 8.26775 8.837 8.23645 8.86829C8.20516 8.89958 8.16801 8.92441 8.12712 8.94135C8.08623 8.95828 8.04241 8.967 7.99815 8.967C7.95389 8.967 7.91007 8.95828 7.86918 8.94135C7.82829 8.92441 7.79114 8.89958 7.75984 8.86829C7.72855 8.837 7.70372 8.79984 7.68679 8.75895C7.66985 8.71807 7.66113 8.67424 7.66113 8.62998C7.66113 8.5406 7.69664 8.45488 7.75984 8.39168C7.82305 8.32848 7.90877 8.29297 7.99815 8.29297C8.08753 8.29297 8.17325 8.32848 8.23645 8.39168C8.29966 8.45488 8.33516 8.5406 8.33516 8.62998Z" fill="#354999"/><path d="M12.1115 11.3441C12.1201 11.3908 12.1189 11.4387 12.1082 11.4848C12.0975 11.531 12.0774 11.5745 12.0492 11.6126C12.021 11.6506 11.9853 11.6825 11.9442 11.7062C11.9032 11.7299 11.8577 11.745 11.8106 11.7504C11.624 11.7654 11.4826 11.63 11.4525 11.4073C11.4518 11.3192 11.4335 11.2322 11.3988 11.1512C11.3641 11.0702 11.3136 10.9969 11.2503 10.9356C11.1871 10.8743 11.1122 10.8262 11.0302 10.794C10.9482 10.7619 10.8606 10.7464 10.7725 10.7484C10.7274 10.7461 10.6832 10.7348 10.6426 10.7151C10.6019 10.6954 10.5657 10.6678 10.5359 10.6338C10.5062 10.5999 10.4835 10.5603 10.4694 10.5174C10.4552 10.4745 10.4498 10.4293 10.4535 10.3843C10.4648 10.2951 10.5104 10.2138 10.5806 10.1576C10.6508 10.1015 10.7401 10.0748 10.8297 10.0834C11.1617 10.097 11.4768 10.2336 11.7137 10.4666C11.9506 10.6996 12.0924 11.0124 12.1115 11.3441Z" fill="#354999"/></svg>`}
            />
            <Text
              style={{
                fontFamily: "MuseoSans_500",
                fontSize: 20,
                textAlign: "center",
                color: "#354999",
              }}
            >
              {wordsLanguage[actualLanguage][6]}
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
              placeholder={`${wordsLanguage[actualLanguage][14]}...`}
              value={searchValue}
              onSubmitEditing={() =>
                filtrarPlanes({
                  cantidadPersonas,
                  test_zona,
                  zonas_gastronomicas,
                })
              }
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
                if (searchValue == "") {
                  openModal();
                } else {
                  filtrarPlanes({
                    cantidadPersonas,
                    test_zona,
                    zonas_gastronomicas,
                  });
                }
              }}
            >
              {searchValue == "" ? (
                <FontAwesome name="filter" size={20} color="#FFF" />
              ) : (
                <FontAwesome name="search" size={20} color="#FFF" />
              )}
            </Pressable>
          </View>

          <FlatList
            horizontal
            ItemSeparatorComponent={() => <View style={{ marginLeft: 5 }} />}
            data={restaurantArrayData}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`(tabs)/planes/${item.nid}`)}
                style={[
                  {
                    width: windowWidth - 100,
                    overflow: "hidden",
                    height:
                      Platform.OS === "ios"
                        ? windowHeight - 460
                        : windowHeight - 330,
                  },
                ]}
              >
                <ImageBackground
                  style={{
                    flex: 1,
                    overflow: "hidden",
                  }}
                  source={{
                    uri: `https://files.visitbogota.co${
                      item.field_img ? item.field_img : "/img/noimg.png"
                    }`,
                  }}
                >
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,.6)", "rgba(0,0,0,.6)"]}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: Colors.white,
                        fontFamily: "MuseoSans_500",
                        fontSize: 20,
                      }}
                    >
                      {item.title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </Pressable>
            )}
            keyExtractor={(item, index) => item.nid}
          />
        </ScrollView>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

export default EventsList;
