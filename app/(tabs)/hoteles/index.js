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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilters, fetchAllHoteles } from "../../../src/store/actions";
import { FlatList } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { CustomCheckbox, PreloaderComponent } from "../../../src/components";
import { router } from "expo-router";
import { windowHeight, windowWidth } from "../../../src/constants/ScreenWidth";
import { Colors } from "../../../src/constants";
import {
  selectActualLanguage,
  selectHotelsData,
  selectHotelsFilterData,
  selectWordsLang,
} from "../../../src/store/selectors";
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles";

const CustomModal = ({
  visible,
  filtrarHoteles,
  closeModal,
  tipos_de_hotel,
  setTipos_de_hotel,
  servicios_de_hoteles,
  setServicios_de_hoteles,
  rangos_de_precios_hoteles,
  setRangos_de_precios_hoteles,
  test_zona,
  setTest_zona,
  limpiarFiltros,
  filtersData,
  wordsLanguage,
  actualLanguage,
}) => {
  const getTitleByIndex = (index) => {
    switch (index) {
      case 0:
        return wordsLanguage[actualLanguage][29];
      case 1:
        return wordsLanguage[actualLanguage][30];
      case 2:
        return wordsLanguage[actualLanguage][26];
      case 3:
        return wordsLanguage[actualLanguage][24];
      default:
        return "";
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
              {filtersData[0].map((item, index) => {
                const isChecked =
                  Array.isArray(tipos_de_hotel) &&
                  tipos_de_hotel.includes(item.tid);
                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setTipos_de_hotel((prevState) => {
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
                const isChecked =
                  Array.isArray(servicios_de_hoteles) &&
                  servicios_de_hoteles.includes(item.tid);
                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setServicios_de_hoteles((prevState) => {
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
              {filtersData[2].map((item, index) => {
                const isChecked =
                  Array.isArray(rangos_de_precios_hoteles) &&
                  rangos_de_precios_hoteles.includes(item.tid);
                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setRangos_de_precios_hoteles((prevState) => {
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
            <Text style={stylesModal.titleFilter}>{getTitleByIndex(3)}</Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {filtersData[3].map((item, index) => {
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
          </View>
          <View style={{ marginVertical: 10 }}>
            <Button
              title={wordsLanguage[actualLanguage][27]}
              onPress={() =>
                filtrarHoteles({
                  tipos_de_hotel,
                  servicios_de_hoteles,
                  rangos_de_precios_hoteles,
                  test_zona,
                })
              }
            />
          </View>
          <View style={{ marginVertical: 10 }}>
            <Button
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
  const dispatch = useDispatch();

  const actualLanguage = useSelector(selectActualLanguage);
  const filtersData = useSelector(selectHotelsFilterData);
  const hotelsData = useSelector(selectHotelsData);
  const wordsLanguage = useSelector(selectWordsLang);
  const [queriesCompleted, setQueriesCompleted] = React.useState(false);
  const [filterModal, setFilterModal] = React.useState(false);
  const [tipos_de_hotel, setTipos_de_hotel] = useState([]);
  const [servicios_de_hoteles, setServicios_de_hoteles] = useState([]);
  const [rangos_de_precios_hoteles, setRangos_de_precios_hoteles] = useState(
    []
  );
  const [test_zona, setTest_zona] = useState([]);
  const [hotelsArrayData, setHotelsArrayData] = useState(hotelsData);
  React.useEffect(() => {
    async function fetchData() {
      await dispatch(fetchAllHoteles());
    }
    async function getFilters() {
      await dispatch(
        fetchAllFilters(
          [
            "tipos_de_hotel",
            "servicios_de_hoteles",
            "rangos_de_precios_hoteles",
            "test_zona",
          ],
          "hoteles"
        )
      );
      setQueriesCompleted(true);
    }
    fetchData();
    getFilters();
  }, [dispatch]);
  // Este useEffect se ejecutará cada vez que hotelsData cambie
  React.useEffect(() => {
    if (hotelsData.length > 0) {
      setHotelsArrayData(hotelsData);
    }
  }, [hotelsData]);

  const openModal = () => {
    setFilterModal(true);
  };

  const closeModal = () => {
    setFilterModal(false);
  };

  const limpiarFiltros = () => {
    setTipos_de_hotel([]);
    setServicios_de_hoteles([]);
    setRangos_de_precios_hoteles([]);
    setTest_zona([]);
    setHotelsArrayData(hotelsData);
    closeModal();
  };

  if (!queriesCompleted) {
    return <PreloaderComponent />;
  }
  return (
    <View>
      <CustomModal
        visible={filterModal}
        closeModal={closeModal}
        queriesCompleted={queriesCompleted}
        filtrarHoteles={async (data) => {
          setQueriesCompleted(false);
          // Desestructuración de las propiedades de data o asignación de valores predeterminados
          const {
            tipos_de_hotel,
            servicios_de_hoteles,
            rangos_de_precios_hoteles,
            test_zona,
          } = data || {};

          // Verificar si las propiedades están vacías
          const tiposDeHotelIsEmpty = tipos_de_hotel.length === 0;
          const serviciosDeHotelesIsEmpty = servicios_de_hoteles.length === 0;
          const rangosDePreciosHotelesIsEmpty =
            rangos_de_precios_hoteles.length === 0;
          const testZonaIsEmpty = test_zona.length === 0;

          if (
            !data ||
            (tiposDeHotelIsEmpty &&
              serviciosDeHotelesIsEmpty &&
              rangosDePreciosHotelesIsEmpty &&
              testZonaIsEmpty)
          ) {
            // Si data es nulo o todas las propiedades están vacías, usar el arreglo original de hoteles
            setHotelsArrayData(hotelsData);
          } else {
            const newData = await fetchBogotaDrplV2(
              `/hotels/all/${
                tiposDeHotelIsEmpty ? "all" : tipos_de_hotel.join("+")
              }/${
                serviciosDeHotelesIsEmpty
                  ? "all"
                  : servicios_de_hoteles.join("+")
              }/${
                rangosDePreciosHotelesIsEmpty
                  ? "all"
                  : rangos_de_precios_hoteles.join("+")
              }/${testZonaIsEmpty ? "all" : test_zona.join("+")}`,
              actualLanguage
            );
            // Actualizar el arreglo de hoteles con los resultados filtrados
            setHotelsArrayData(newData);
          }
          // Cerrar el modal
          closeModal();
          setQueriesCompleted(true);
        }}
        limpiarFiltros={limpiarFiltros}
        tipos_de_hotel={tipos_de_hotel}
        setTipos_de_hotel={setTipos_de_hotel}
        servicios_de_hoteles={servicios_de_hoteles}
        setServicios_de_hoteles={setServicios_de_hoteles}
        rangos_de_precios_hoteles={rangos_de_precios_hoteles}
        setRangos_de_precios_hoteles={setRangos_de_precios_hoteles}
        test_zona={test_zona}
        setTest_zona={setTest_zona}
        filtersData={filtersData}
        wordsLanguage={wordsLanguage}
        actualLanguage={actualLanguage}
      />
      <Text
        style={{
          fontFamily: "MuseoSans_500",
          fontSize: 20,
          textAlign: "center",
          paddingVertical: 20,
          color: "#354999",
        }}
      >
        {wordsLanguage[actualLanguage][21]}
      </Text>
      <Pressable
        style={({ pressed }) => [
          { opacity: pressed ? 0.5 : 1 },
          {
            alignItems: "center",
            backgroundColor: "#354999",
            flexDirection: "row",
            padding: 10,
            justifyContent: "center",
            width: windowWidth,
            gap: 15,
          },
        ]}
        onPress={openModal}
      >
        <FontAwesome name="filter" size={24} color="#FFF" />
        <Text
          style={{ color: "#FFF", fontFamily: "MuseoSans_500", fontSize: 20 }}
        >
          {wordsLanguage[actualLanguage][22]}
        </Text>
      </Pressable>
      <FlatList
        style={{ height: windowHeight - 210 }}
        numColumns={3}
        data={hotelsArrayData}
        extraData={hotelsArrayData}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              style={{
                fontFamily: "MuseoSans_500",
                fontSize: 22,
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              {wordsLanguage[actualLanguage][32]}
            </Text>
            <Pressable
              onPress={limpiarFiltros}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.5 : 1,
                },
                {
                  backgroundColor: "#354999",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 15,
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: "MuseoSans_500",
                  fontSize: 16,
                  color: "#FFF",
                  textAlign: "center",
                }}
              >
                {wordsLanguage[actualLanguage][28]}
              </Text>
            </Pressable>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`(tabs)/hoteles/${item.nid}`)}
            style={{ width: windowWidth / 3, height: windowWidth / 3 }}
          >
            <ImageBackground
              style={{ flex: 1 }}
              source={{
                uri: `https://files.visitbogota.co${
                  item.field_img ? item.field_img : "/img/noimg.png"
                }`,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,.3)",
                  flex: 1,
                  padding: 5,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: "MuseoSans_500",
                    fontSize: 14,
                    textShadowColor: "rgba(0, 0, 0, .7)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 10,
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  {item.title}
                </Text>
              </View>
            </ImageBackground>
          </Pressable>
        )}
      />
    </View>
  );
};

export default EventsList;
