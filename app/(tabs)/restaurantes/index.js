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
import {
  fetchAllFilters,
  fetchAllRestaurants,
} from "../../../src/store/actions";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { CustomCheckbox, PreloaderComponent } from "../../../src/components";
import { Link, router, useLocalSearchParams } from "expo-router";
import { windowHeight, windowWidth } from "../../../src/constants/ScreenWidth";
import { Colors } from "../../../src/constants";
import {
  selectActualLanguage,
  selectRestaurantsData,
  selectRestaurantsFilterData,
  selectWordsLang,
} from "../../../src/store/selectors";
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles";
import IconSvg from "../../../src/components/IconSvg";

const CustomModal = ({
  visible,
  filtersData,
  filtrarHoteles,
  closeModal,
  categoria_restaurantes,
  setCategoria_restaurantes,
  test_zona,
  setTest_zona,
  zonas_gastronomicas,
  setZonas_gastronomicas,
  rangos_de_precio,
  setRangos_de_precio,
  limpiarFiltros,
  wordsLanguage,
  actualLanguage,
}) => {
  const getTitleByIndex = (index) => {
    switch (index) {
      case 0:
        return wordsLanguage[actualLanguage][23];
      case 1:
        return wordsLanguage[actualLanguage][24];
      case 2:
        return wordsLanguage[actualLanguage][25];
      case 3:
        return wordsLanguage[actualLanguage][26];
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
                  Array.isArray(categoria_restaurantes) &&
                  categoria_restaurantes.includes(item.tid);
                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      label={item.name}
                      onPress={() => {
                        setCategoria_restaurantes((prevState) => {
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
              {filtersData[2].map((item, index) => {
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
                  Array.isArray(rangos_de_precio) &&
                  rangos_de_precio.includes(item.tid);
                const iconosRepetidos = () =>
                  Array.from({ length: parseInt(item.name) }, () => (
                    <FontAwesome name="star" size={13} color="#333" />
                  )); // Crear la cadena con el icono repetido
                return (
                  <View style={{ width: "50%" }} key={item.tid}>
                    <CustomCheckbox
                      checked={isChecked}
                      styleText={{ lineHeight: 22 }}
                      label={iconosRepetidos()}
                      onPress={() => {
                        setRangos_de_precio((prevState) => {
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
                  categoria_restaurantes,
                  test_zona,
                  zonas_gastronomicas,
                  rangos_de_precio,
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
  const { zone, zoneName, atractivoId, filterID } = useLocalSearchParams();
  const dispatch = useDispatch();
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const restaurantsData = useSelector(selectRestaurantsData);
  const filtersData = useSelector(selectRestaurantsFilterData);
  const [queriesCompleted, setQueriesCompleted] = React.useState(false);
  const [filterModal, setFilterModal] = React.useState(false);

  const [categoria_restaurantes, setCategoria_restaurantes] = useState([]);
  const [test_zona, setTest_zona] = useState([]);
  const [zonas_gastronomicas, setZonas_gastronomicas] = useState([]);
  const [rangos_de_precio, setRangos_de_precio] = useState([]);
  const [restaurantArrayData, setRestaurantArrayData] =
    useState(restaurantsData);
  React.useEffect(() => {
    async function fetchData() {
      await dispatch(fetchAllRestaurants(zone));
    }
    async function getFilters() {
      await dispatch(
        fetchAllFilters(
          [
            "categoria_restaurantes",
            "test_zona",
            "zonas_gastronomicas",
            "rangos_de_precio",
          ],
          "restaurantes"
        )
      );
      setQueriesCompleted(true);
    }
    fetchData();
    getFilters();
  }, [zone, zoneName, atractivoId, filterID]);
  // Este useEffect se ejecutará cada vez que restaurantsData cambie
  React.useEffect(() => {
    if (restaurantsData.length > 0) {
      setRestaurantArrayData(restaurantsData);
    }
  }, [restaurantsData]);
  const openModal = () => {
    setFilterModal(true);
  };

  const closeModal = () => {
    setFilterModal(false);
  };

  const limpiarFiltros = () => {
    setCategoria_restaurantes([]);
    setTest_zona([]);
    setZonas_gastronomicas([]);
    setRangos_de_precio([]);
    setRestaurantArrayData(restaurantsData);
    closeModal();
  };
  if (!queriesCompleted) {
    return <PreloaderComponent />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 20,
        }}
      >
        <IconSvg
          width="24"
          height="24"
          icon={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.375 14.9999H19.9748L21.7399 7.5865C21.7625 7.49057 21.7465 7.38957 21.6953 7.30535C21.6441 7.22113 21.5617 7.16048 21.4661 7.1365L19.9661 6.7615C19.8709 6.73764 19.7702 6.75203 19.6855 6.8016C19.6008 6.85117 19.5389 6.93195 19.5131 7.02663L17.3385 14.9999H16.4902C16.7384 14.6772 16.8736 14.2819 16.875 13.8749V12.7499H15.75C15.3096 12.7509 14.8836 12.907 14.5468 13.1906C14.2099 13.4743 13.9836 13.8675 13.9076 14.3013C13.7636 14.0925 13.5783 13.9155 13.3632 13.7812C13.1481 13.6469 12.9077 13.5582 12.6569 13.5205C12.4061 13.4828 12.1503 13.497 11.9052 13.5621C11.6601 13.6273 11.431 13.742 11.232 13.8993C12 10.6158 12 10.5749 12 10.4999C11.9999 10.2918 11.9566 10.086 11.8727 9.89564C11.7888 9.70524 11.6662 9.53437 11.5127 9.3939C11.3592 9.25343 11.1782 9.14642 10.9811 9.07969C10.7841 9.01295 10.5753 8.98794 10.368 9.00625C10.2155 8.56574 9.92948 8.18371 9.54974 7.91332C9.16999 7.64293 8.71542 7.49763 8.24925 7.49763C7.78308 7.49763 7.32851 7.64293 6.94876 7.91332C6.56902 8.18371 6.283 8.56574 6.1305 9.00625C5.92336 8.98816 5.71473 9.01334 5.51784 9.08017C5.32095 9.14701 5.1401 9.25405 4.98678 9.3945C4.83346 9.53495 4.71102 9.70574 4.62722 9.89603C4.54342 10.0863 4.5001 10.292 4.5 10.4999C4.5 10.6015 4.50225 10.7714 5.1375 12.7761C5.05072 12.7612 4.96301 12.7525 4.875 12.7499H3.75V13.8749C3.75138 14.2819 3.88657 14.6772 4.13475 14.9999H2.625C2.52554 14.9999 2.43016 15.0394 2.35984 15.1097C2.28951 15.18 2.25 15.2754 2.25 15.3749C2.25 18.865 5.52225 21.0749 6.375 21.5905V22.8749C6.375 22.9743 6.41451 23.0697 6.48483 23.14C6.55516 23.2104 6.65054 23.2499 6.75 23.2499H17.25C17.3495 23.2499 17.4448 23.2104 17.5152 23.14C17.5855 23.0697 17.625 22.9743 17.625 22.8749V21.5905C18.4778 21.0749 21.75 18.865 21.75 15.3749C21.75 15.2754 21.7105 15.18 21.6402 15.1097C21.5698 15.0394 21.4745 14.9999 21.375 14.9999ZM20.1401 7.57788L20.9242 7.77363L19.2038 14.9999H18.1163L20.1401 7.57788ZM14.625 14.6249C14.625 14.3265 14.7435 14.0404 14.9545 13.8294C15.1655 13.6184 15.4516 13.4999 15.75 13.4999H16.125V13.8749C16.125 14.1732 16.0065 14.4594 15.7955 14.6704C15.5845 14.8814 15.2984 14.9999 15 14.9999H14.625V14.6249ZM12.375 14.2499C12.6076 14.2502 12.8344 14.3224 13.0244 14.4567C13.2143 14.5909 13.358 14.7807 13.4359 14.9999H11.3141C11.392 14.7807 11.5357 14.5909 11.7256 14.4567C11.9156 14.3224 12.1424 14.2502 12.375 14.2499ZM10.4359 14.9999H8.31413C8.39158 14.7804 8.53521 14.5903 8.72522 14.4559C8.91522 14.3215 9.14225 14.2493 9.375 14.2493C9.60775 14.2493 9.83478 14.3215 10.0248 14.4559C10.2148 14.5903 10.3584 14.7804 10.4359 14.9999ZM5.25 10.4999C5.2473 10.3771 5.2753 10.2557 5.33148 10.1465C5.38766 10.0373 5.47023 9.94391 5.57168 9.87476C5.67313 9.80561 5.79025 9.76291 5.9124 9.75053C6.03455 9.73815 6.15786 9.75649 6.27112 9.80388C6.3232 9.82376 6.37906 9.83177 6.43463 9.82735C6.4902 9.82292 6.54408 9.80616 6.59236 9.77829C6.64063 9.75041 6.68209 9.71213 6.7137 9.66622C6.74532 9.6203 6.7663 9.56792 6.77512 9.51288C6.8297 9.16088 7.00838 8.84001 7.27886 8.60824C7.54934 8.37647 7.8938 8.24907 8.25 8.24907C8.6062 8.24907 8.95066 8.37647 9.22114 8.60824C9.49162 8.84001 9.6703 9.16088 9.72488 9.51288C9.7337 9.56792 9.75468 9.6203 9.7863 9.66622C9.81791 9.71213 9.85937 9.75041 9.90764 9.77829C9.95592 9.80616 10.0098 9.82292 10.0654 9.82735C10.1209 9.83177 10.1768 9.82376 10.2289 9.80388C10.3401 9.75735 10.4611 9.73883 10.5812 9.74997C10.7013 9.7611 10.8168 9.80154 10.9176 9.86774C11.0185 9.93394 11.1015 10.0239 11.1594 10.1296C11.2174 10.2354 11.2485 10.3538 11.25 10.4744C11.1997 10.7403 10.7603 12.6258 10.4715 13.8606C10.1536 13.627 9.76953 13.5006 9.375 13.4999C8.94292 13.5004 8.52424 13.6499 8.18953 13.9231C7.85482 14.1964 7.62454 14.5767 7.5375 14.9999H6.75V14.6249C6.74896 14.3467 6.68567 14.0723 6.56479 13.8218C6.4439 13.5712 6.26848 13.3509 6.05137 13.177C5.35462 11.0046 5.25787 10.57 5.25 10.4999ZM4.5 13.8749V13.4999H4.875C5.17337 13.4999 5.45952 13.6184 5.6705 13.8294C5.88147 14.0404 6 14.3265 6 14.6249V14.9999H5.625C5.32663 14.9999 5.04048 14.8814 4.8295 14.6704C4.61853 14.4594 4.5 14.1732 4.5 13.8749ZM17.1488 20.9999H15.375V21.7499H16.875V22.4999H7.125V21.7499H12V20.9999H6.85125C6.429 20.7501 4.28362 19.3915 3.39225 17.2499H7.5V16.4999H3.14438C3.08098 16.2538 3.03783 16.003 3.01538 15.7499H20.9846C20.9622 16.003 20.919 16.2538 20.8556 16.4999H12.75V17.2499H20.6077C19.7164 19.3915 17.571 20.7501 17.1488 20.9999Z" fill="#354999"/><path d="M8.25 16.5H9V17.25H8.25V16.5Z" fill="#354999"/><path d="M9.75 16.5H10.5V17.25H9.75V16.5Z" fill="#354999"/><path d="M11.25 16.5H12V17.25H11.25V16.5Z" fill="#354999"/><path d="M11.4341 6.50775C11.3398 6.72426 11.3174 6.96534 11.3704 7.1955C11.532 7.953 12.4061 8.72325 13.404 8.98762C14.1664 9.19513 14.9479 9.32492 15.7365 9.375H15.75C15.819 9.37497 15.8866 9.35592 15.9454 9.31996C16.0042 9.284 16.052 9.23251 16.0835 9.17115C16.115 9.1098 16.1289 9.04095 16.1238 8.97219C16.1187 8.90342 16.0947 8.8374 16.0545 8.78137C16.0504 8.77537 15.6304 8.19187 14.922 7.27125C14.6074 6.86212 13.7719 5.89875 12.8115 5.78475C12.519 5.7483 12.2225 5.80652 11.9655 5.95088C11.7575 5.85641 11.5803 5.70552 11.4538 5.51533C11.3273 5.32515 11.2567 5.1033 11.25 4.875H10.5C10.4998 5.20498 10.5859 5.52928 10.7498 5.8157C10.9136 6.10212 11.1496 6.3407 11.4341 6.50775ZM12.6304 6.52387C12.6613 6.52387 12.6923 6.52587 12.723 6.52988C13.1861 6.58463 13.8008 7.044 14.328 7.72988C14.5684 8.04263 14.7754 8.31563 14.9434 8.53988C14.4894 8.47317 14.0396 8.3809 13.596 8.2635C12.8153 8.05687 12.1943 7.46438 12.1039 7.04025C12.0846 6.97219 12.0868 6.89982 12.1104 6.83311C12.134 6.76641 12.1777 6.70867 12.2355 6.66788C12.3458 6.57459 12.4859 6.52391 12.6304 6.525V6.52387Z" fill="#354999"/><path d="M6.75 11.25H7.5V12H6.75V11.25Z" fill="#354999"/><path d="M8.625 12H9.375V12.75H8.625V12Z" fill="#354999"/><path d="M4.10435 6.74995C4.2026 6.7552 4.55772 6.77245 5.02722 6.77245C5.96135 6.77245 7.34735 6.70345 8.0501 6.33183C8.51746 6.05835 8.86223 5.61615 9.01347 5.0962C9.10455 4.8514 9.1464 4.59103 9.13662 4.33002C9.12684 4.06901 9.06562 3.8125 8.95647 3.5752C8.4941 2.69995 7.0946 2.5702 6.19985 3.04345C5.13072 3.60858 3.92435 5.94108 3.79047 6.20508C3.76208 6.26072 3.74804 6.32258 3.74963 6.38503C3.75122 6.44748 3.76839 6.50854 3.79957 6.56268C3.83075 6.61681 3.87496 6.66229 3.92819 6.695C3.98141 6.7277 4.04197 6.74659 4.10435 6.74995ZM6.29022 4.67808L5.14722 5.34483C5.3231 5.06695 5.51547 4.78758 5.70972 4.53333L6.29022 4.67808ZM6.74997 5.2777V5.91933C6.33158 5.97322 5.9106 6.00464 5.48885 6.01345L6.74997 5.2777ZM8.30022 4.8652C8.20728 5.19865 7.99335 5.48546 7.70022 5.66958C7.6355 5.70116 7.56872 5.72835 7.50035 5.75095V4.84045L8.38272 4.32558C8.38554 4.50843 8.35765 4.69045 8.30022 4.86408V4.8652ZM8.0171 3.67158L7.2176 4.13808L6.28197 3.90408C6.36443 3.82918 6.45484 3.76353 6.5516 3.70833C6.77785 3.59396 7.02666 3.53125 7.28009 3.5247C7.53352 3.51815 7.78524 3.56793 8.0171 3.67045V3.67158Z" fill="#354999"/><path d="M16.875 3.75H17.625C17.7245 3.75 17.8198 3.71049 17.8902 3.64016C17.9605 3.56984 18 3.47446 18 3.375C17.9992 2.67905 17.7224 2.01183 17.2303 1.51972C16.7382 1.02761 16.0709 0.750794 15.375 0.75H14.625C14.5255 0.75 14.4302 0.789509 14.3598 0.859835C14.2895 0.930161 14.25 1.02554 14.25 1.125C14.2508 1.82095 14.5276 2.48817 15.0197 2.98028C15.5118 3.47239 16.1791 3.74921 16.875 3.75ZM15.375 1.5C15.8071 1.50048 16.2258 1.64994 16.5605 1.92319C16.8953 2.19643 17.1255 2.57675 17.2125 3H16.875C16.4429 2.99952 16.0242 2.85006 15.6895 2.57681C15.3547 2.30357 15.1245 1.92325 15.0375 1.5H15.375Z" fill="#354999"/><path d="M12.375 3.75C12.5975 3.75 12.815 3.68402 13 3.5604C13.185 3.43679 13.3292 3.26109 13.4144 3.05552C13.4995 2.84995 13.5218 2.62375 13.4784 2.40552C13.435 2.1873 13.3278 1.98684 13.1705 1.82951C13.0132 1.67217 12.8127 1.56503 12.5945 1.52162C12.3762 1.47821 12.15 1.50049 11.9445 1.58564C11.7389 1.67078 11.5632 1.81498 11.4396 1.99998C11.316 2.18499 11.25 2.4025 11.25 2.625C11.25 2.92337 11.3685 3.20952 11.5795 3.4205C11.7905 3.63147 12.0766 3.75 12.375 3.75ZM12.375 2.25C12.4492 2.25 12.5217 2.27199 12.5833 2.3132C12.645 2.3544 12.6931 2.41297 12.7215 2.48149C12.7498 2.55002 12.7573 2.62542 12.7428 2.69816C12.7283 2.7709 12.6926 2.83772 12.6402 2.89017C12.5877 2.94261 12.5209 2.97833 12.4482 2.9928C12.3754 3.00726 12.3 2.99984 12.2315 2.97146C12.163 2.94307 12.1044 2.89501 12.0632 2.83334C12.022 2.77167 12 2.69917 12 2.625C12 2.52554 12.0395 2.43016 12.1098 2.35984C12.1802 2.28951 12.2755 2.25 12.375 2.25Z" fill="#354999"/><path d="M16.5 6C16.5 6.2225 16.566 6.44001 16.6896 6.62502C16.8132 6.81002 16.9889 6.95422 17.1945 7.03936C17.4 7.12451 17.6262 7.14679 17.8445 7.10338C18.0627 7.05998 18.2632 6.95283 18.4205 6.7955C18.5778 6.63816 18.685 6.43771 18.7284 6.21948C18.7718 6.00125 18.7495 5.77505 18.6644 5.56948C18.5792 5.36391 18.435 5.18821 18.25 5.0646C18.065 4.94098 17.8475 4.875 17.625 4.875C17.3266 4.875 17.0405 4.99353 16.8295 5.2045C16.6185 5.41548 16.5 5.70163 16.5 6ZM18 6C18 6.07417 17.978 6.14667 17.9368 6.20834C17.8956 6.27001 17.837 6.31807 17.7685 6.34645C17.7 6.37484 17.6246 6.38226 17.5518 6.36779C17.4791 6.35333 17.4123 6.31761 17.3598 6.26517C17.3074 6.21272 17.2717 6.1459 17.2572 6.07316C17.2427 6.00042 17.2502 5.92502 17.2785 5.85649C17.3069 5.78797 17.355 5.7294 17.4167 5.6882C17.4783 5.64699 17.5508 5.625 17.625 5.625C17.7245 5.625 17.8198 5.66451 17.8902 5.73484C17.9605 5.80516 18 5.90054 18 6Z" fill="#354999"/><path d="M13.875 10.875H14.625V11.625H13.875V10.875Z" fill="#354999"/><path d="M15 4.5H15.75V5.25H15V4.5Z" fill="#354999"/><path d="M9 1.125H9.75V1.875H9V1.125Z" fill="#354999"/><path d="M16.875 9.375H17.625V10.125H16.875V9.375Z" fill="#354999"/></svg>`}
        />
        <Text
          style={{
            fontFamily: "MuseoSans_500",
            fontSize: 25,
            lineHeight: 25,
            paddingVertical: 20,
            color: "#354999",
            width: "80%",
          }}
        >
          {zoneName}
        </Text>
      </View>

      <FlatList
        style={{ height: windowHeight - 210 }}
        data={restaurantArrayData}
        extraData={restaurantArrayData}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        renderItem={({ item }) => (
          <Link
            style={{ marginBottom: 10, height: 155 }}
            href={{
              pathname: `/restaurantes/${item.nid}`,
              params: { zone, zoneName, atractivoId, filterID },
            }}
          >
            <ImageBackground
              source={{
                uri: `https://files.visitbogota.co${
                  item.field_img ? item.field_img : "/img/noimg.png"
                }`,
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0,0,0,.3)",
                  width: windowWidth - 20,
                  height: 155,
                  overflow: "hidden",
                  padding: 5,
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: "MuseoSans_700",
                    fontSize: 22,
                    textShadowColor: "rgba(0, 0, 0, .7)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 10,
                    marginBottom: 15,
                  }}
                >
                  {item.title}
                </Text>
              </View>
            </ImageBackground>
          </Link>
        )}
      />
    </GestureHandlerRootView>
  );
};

export default EventsList;
