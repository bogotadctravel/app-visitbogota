import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Colors } from "../../../src/constants";
import { CustomCheckbox, PreloaderComponent } from "../../../src/components";
import {
  fetchBogotaDrpl,
  fetchBogotaDrplV2,
  number_format,
} from "../../../src/api/imperdibles";
import { useLocalSearchParams } from "expo-router";
import { windowWidth } from "../../../src/constants/ScreenWidth";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import {
  selectActualLanguage,
  selectWordsLang,
} from "../../../src/store/selectors";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import IconSvg from "../../../src/components/IconSvg";
import Carousel from "react-native-reanimated-carousel";

const ModalReserva = (
  plan,
  aceptPolitics,
  setAceptPolitics,
  formValues,
  setFormValues,
  formModal,
  setFormModal,
  wordsLanguage,
  actualLanguage,
  sendFormInfo,
  setSendFormInfo,
  company,
  complete,
  setComplete,
  serial,
  setSerial
) => {
  const sendForm = async () => {
    setSendFormInfo(true);
    try {
      const formData = new FormData();

      // Iterate over formValues and append each key-value pair to formData
      for (const key in formValues) {
        if (formValues.hasOwnProperty(key)) {
          formData.append(key, formValues[key]);
        }
      }

      const requestOptions = {
        method: "POST",
        body: formData,
        redirect: "follow",
      };

      const response = await fetch(
        "https://files.visitbogota.co/plan-bogota/s/restPost/",
        requestOptions
      );

      const result = await response.json();
      setSerial(result.serial);
      setSendFormInfo(true);
      setComplete(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const resetAll = () => {
    setFormModal(false);
    setComplete(false);
    setSendFormInfo(false);
    setSerial("");
    setFormValues((prevState) => ({
      ...prevState,
      uname: "",
      uemail: "",
      uphone: "",
    }));
  };

  return (
    <Modal
      visible={formModal}
      transparent
      style={{ flex: 1 }}
      onRequestClose={setFormModal}
    >
      <LinearGradient
        style={{ flex: 1, padding: 10 }}
        colors={["#6dd194", "#266dcd"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable
          onPress={resetAll}
          style={{ alignSelf: "flex-end", padding: 10 }}
        >
          <Ionicons name="close" size={35} color="#FFF" />
        </Pressable>
        {complete ? (
          <View
            style={{ backgroundColor: "#FFF", padding: 20, borderRadius: 18 }}
          >
            <Text
              style={{
                color: "#354999",
                fontFamily: "MuseoSans_500",
                textAlign: "center",
                fontSize: 35,
                marginBottom: 15,
              }}
            >
              ¡El plan que soñaste es casi una realidad!
            </Text>
            <Text
              style={{
                color: "#354999",
                fontFamily: "MuseoSans_500",
                textAlign: "center",
                fontSize: 25,
                marginBottom: 15,
              }}
            >
              Código de tu reserva en Plan Bogotá:
            </Text>
            <Text
              style={{
                color: "#354999",
                fontFamily: "MuseoSans_500",
                textAlign: "center",
                fontSize: 30,
                marginBottom: 15,
              }}
            >
              {serial}
            </Text>
            <Text
              style={{
                color: "#333",
                fontFamily: "MuseoSans_500",
                fontSize: 14,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#333",
                  fontFamily: "MuseoSans_500",
                  fontSize: 14,
                  marginBottom: 15,
                }}
              >
                Oferta reservada:
              </Text>
              {plan.title}
            </Text>
            <Text
              style={{
                color: "#333",
                fontFamily: "MuseoSans_500",
                fontSize: 14,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#333",
                  fontFamily: "MuseoSans_500",
                  fontSize: 14,
                  marginBottom: 15,
                }}
              >
                Empresa responsable:
              </Text>
              {company && company.field_pb_empresa_titulo}
            </Text>
            <Text
              style={{
                color: "#333",
                fontFamily: "MuseoSans_500",
                fontSize: 14,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#333",
                  fontFamily: "MuseoSans_500",
                  fontSize: 14,
                  marginBottom: 15,
                }}
              >
                Correo de contacto:
              </Text>
              {company.field_pb_empresa_email}
            </Text>
            <Text
              style={{
                color: "#333",
                fontFamily: "MuseoSans_500",
                fontSize: 14,
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  color: "#333",
                  fontFamily: "MuseoSans_500",
                  fontSize: 14,
                  marginBottom: 15,
                }}
              >
                Teléfono de contacto:
              </Text>
              {company.field_pb_empresa_telefono}
            </Text>
            <Text
              style={{
                color: "#333",
                fontFamily: "MuseoSans_500",
                fontSize: 18,
                marginBottom: 15,
              }}
            >
              Usa el siguiente link para finalizar tu compra:
            </Text>
            <Pressable
              onPress={() =>
                WebBrowser.openBrowserAsync(company.field_pb_empresa_direccion)
              }
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Text
                style={{
                  color: "#354999",
                  fontFamily: "MuseoSans_500",
                  fontSize: 18,
                  textDecorationLine: "underline",
                  marginBottom: 15,
                }}
              >
                {company.field_pb_empresa_direccion}
              </Text>
            </Pressable>

            <Pressable>
              <Text></Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView>
            <Text
              style={{
                color: Colors.white,
                fontFamily: "MuseoSans_500",
                fontSize: 30,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {wordsLanguage[actualLanguage][39]}
            </Text>
            <Text
              style={{
                color: Colors.white,
                fontFamily: "MuseoSans_500",
                fontSize: 25,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {plan.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  position: "relative",
                  alignItems: "flex-end",
                  paddingVertical: 10,
                  paddingLeft: 25,
                  paddingRight: 10,
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    opacity: 0.8,
                    fontFamily: "MuseoSans_500",
                    fontSize: 25,
                    textAlign: "center",
                  }}
                >
                  ${number_format(plan.field_pa, 0, ".", ".")}
                </Text>
                <View
                  style={{
                    position: "absolute",
                    height: 2,
                    width: 100,
                    backgroundColor: "#FFF",
                    top: 19,
                    transform: [
                      {
                        rotate: "-5deg",
                      },
                    ],
                  }}
                />
              </View>
              <Text
                style={{
                  color: Colors.white,
                  fontFamily: "MuseoSans_500",
                  fontSize: 35,

                  textAlign: "center",
                }}
              >
                ${number_format(plan.field_pd, 0, ".", ".")}
              </Text>
              <View
                style={{
                  backgroundColor: "#354999",
                  width: 80,
                  height: 80,
                  borderRadius: 80,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "flex-end",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: "MuseoSans_500",
                    fontSize: 22,
                    textAlign: "center",
                  }}
                >
                  {plan.field_percent}%
                </Text>
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: "MuseoSans_500",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  DCTO
                </Text>
              </View>
            </View>
            <View style={{ padding: 20, marginVertical: 30, gap: 15 }}>
              <TextInput
                value={formValues.uname}
                onChangeText={(text) => {
                  setFormValues((prevState) => ({
                    ...prevState,
                    uname: text,
                  }));
                }}
                placeholder={wordsLanguage[actualLanguage][41]}
                placeholderTextColor="#FFF"
                style={{
                  color: "#FFF",
                  fontFamily: "MuseoSans_500",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: "rgba(255,255,255,.18)",
                  borderRadius: 25,
                }}
              />
              <TextInput
                value={formValues.uemail}
                placeholder={wordsLanguage[actualLanguage][42]}
                onChangeText={(text) => {
                  setFormValues((prevState) => ({
                    ...prevState,
                    uemail: text,
                  }));
                }}
                keyboardType="email-address"
                placeholderTextColor="#FFF"
                style={{
                  color: "#FFF",
                  fontFamily: "MuseoSans_500",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: "rgba(255,255,255,.18)",
                  borderRadius: 25,
                }}
              />
              <TextInput
                value={formValues.uphone}
                keyboardType="number-pad"
                placeholder={wordsLanguage[actualLanguage][43]}
                placeholderTextColor="#FFF"
                onChangeText={(text) => {
                  setFormValues((prevState) => ({
                    ...prevState,
                    uphone: text,
                  }));
                }}
                style={{
                  color: "#FFF",
                  fontFamily: "MuseoSans_500",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  backgroundColor: "rgba(255,255,255,.18)",
                  borderRadius: 25,
                }}
              />

              <CustomCheckbox
                light
                checked={aceptPolitics}
                label={wordsLanguage[actualLanguage][40]}
                onPress={() => {
                  setAceptPolitics(!aceptPolitics);
                }}
              />

              <Pressable
                onPress={sendForm}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                  {
                    backgroundColor: "#354999",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 25,
                    padding: 15,
                    margin: 20,
                  },
                ]}
              >
                {sendFormInfo ? (
                  <ActivityIndicator size={15} color="#FFF" />
                ) : (
                  <Text
                    style={{
                      color: Colors.white,
                      fontFamily: "MuseoSans_500",
                      fontSize: 20,
                      textAlign: "center",
                    }}
                  >
                    {wordsLanguage[actualLanguage][38]}
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </Modal>
  );
};
const SinglePlan = () => {
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const { id } = useLocalSearchParams();
  const [plan, setPlan] = React.useState(null);
  const [sendFormInfo, setSendFormInfo] = React.useState(false);

  const [company, setCompany] = React.useState(null);
  const [galeria, setGaleria] = React.useState([]);
  const [aceptPolitics, setAceptPolitics] = React.useState(true);
  const [formValues, setFormValues] = React.useState({
    uname: "",
    uemail: "",
    uphone: "",
    uprice: "",
    uofertaid: "",
    uoferta: "",
    ucompanyid: "",
    ucompanyname: "",
    ucompanyemail: "",
    ucompanyphone: "",
    ucompanylink: "",
    ocategoryid: "",
    ocategory: "",
    ccategoryid: "",
    ccategory: "",
    numberPersons: "1",
  });
  const [formModal, setFormModal] = React.useState(false);
  const [complete, setComplete] = React.useState(false);
  const [serial, setSerial] = React.useState("");
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const planData = await fetchBogotaDrplV2(
          `/all_ofertas/${id}/all/all/all/all`,
          actualLanguage
        );
        const companyData = await fetchBogotaDrpl(
          `/rld_operadores/${planData[0].field_pb_oferta_empresa}`
        );

        const plan = planData[0];
        const company = companyData[0];

        setPlan(plan);
        setCompany(company);
        setGaleria([
          plan.field_gal_1,
          plan.field_gal_2,
          plan.field_gal_3,
          plan.field_gal_4,
          plan.field_gal_5,
        ]);

        setFormValues((prevState) => ({
          ...prevState,
          uprice: plan.field_pd,
          uofertaid: id,
          uoferta: plan.title,
          ucompanyid: plan.field_pb_oferta_empresa,
          ocategoryid: plan.field_segment ? plan.field_segment : 0,
          ocategory: plan.field_segment_1,
          ucompanyid: plan.field_pb_oferta_empresa,
          ucompanyname: company.field_pb_empresa_titulo,
          ucompanyemail: company.field_pb_empresa_email,
          ucompanyphone: company.field_pb_empresa_telefono,
          ucompanylink: company.field_pb_empresa_direccion,
          ccategoryid: company.field_segment,
          ccategory: company.field_segment_1,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!plan) {
    return <PreloaderComponent planBogota />;
  }
  const source = {
    html: plan.body_1,
  };

  const tagsStyles = {
    p: {
      textAlign: "left",
      color: "#777",
      fontFamily: "MuseoSans_500",
      fontSize: 16,
      lineHeight: 20,
      marginBottom: 5,
      marginTop: 5,
    },
    ul: { paddingLeft: 25, margin: 0 },
    li: {
      textAlign: "left",
      color: "#777",
      fontFamily: "MuseoSans_500",
      fontSize: 16,
      lineHeight: 20,
    },
  };

  const renderImages = () => {
    return galeria.map((item, index) => {
      if (!item || item.trim() === "") {
        return null; // No renderizar imagen si la URL está vacía
      }
      return (
        <ImageBackground
          key={index}
          source={{ uri: `https://files.visitbogota.co${item.trim()}` }}
          style={styles.imageBackground}
        >
          <Image
            source={{ uri: `https://files.visitbogota.co${item.trim()}` }}
            style={styles.image}
          />
        </ImageBackground>
      );
    });
  };
  const imagesData = galeria.map((img, index) => ({
    uri: `https://files.visitbogota.co${img.trim()}`,
  }));
  return (
    <ScrollView>
      {ModalReserva(
        plan,
        aceptPolitics,
        setAceptPolitics,
        formValues,
        setFormValues,
        formModal,
        setFormModal,
        wordsLanguage,
        actualLanguage,
        sendFormInfo,
        setSendFormInfo,
        company,
        complete,
        setComplete,
        serial,
        setSerial
      )}
      <ImageBackground
        style={{
          width: windowWidth,
          height: windowWidth - 120,
        }}
        source={{
          uri: `https://files.visitbogota.co${
            plan.field_img ? plan.field_img : "/img/noimg.png"
          }`,
        }}
      ></ImageBackground>
      <View
        style={{
          backgroundColor: "rgb(255,255,255)",
          flex: 1,
          marginHorizontal: 20,
          borderRadius: 10,
          padding: 20,
          justifyContent: "flex-end",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginTop: -70,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: Colors.orange,
              fontFamily: "MuseoSans_500",
              fontSize: 20,
              marginBottom: 10,
              maxWidth: 280,
            }}
          >
            {plan.title}
          </Text>
          <View
            style={{
              backgroundColor: Colors.orange,
              width: 30,
              height: 30,
              borderRadius: 30 / 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSvg
              width="18"
              height="18"
              icon={`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5256 17.3142C1.38718 17.275 1.24575 17.2419 1.11034 17.1908C0.788789 17.0746 0.510271 16.8632 0.311902 16.5847C0.113533 16.3063 0.0047333 15.974 0 15.6321C0 12.8136 0 10.0001 0 7.19166C0.00553427 6.74574 0.186365 6.31992 0.503388 6.00627C0.820411 5.69263 1.24815 5.51637 1.6941 5.51562C1.97996 5.51562 2.26883 5.51562 2.57275 5.51562C2.57275 5.36516 2.57275 5.23276 2.57275 5.09736C2.57275 4.77414 2.70114 4.46417 2.92969 4.23563C3.15824 4.00708 3.46821 3.87868 3.79142 3.87868C4.11463 3.87868 4.42461 4.00708 4.65315 4.23563C4.8817 4.46417 5.01009 4.77414 5.01009 5.09736C5.01009 5.23276 5.01009 5.36817 5.01009 5.51862H5.78342C6.12345 5.51862 6.46046 5.51862 6.80048 5.51862C6.84686 5.52298 6.89344 5.51288 6.93384 5.48972C6.97425 5.46655 7.0065 5.43145 7.02616 5.38923C7.37522 4.78742 7.7363 4.18561 8.08836 3.5838C8.1262 3.50832 8.18555 3.44575 8.25892 3.40398C8.33229 3.36221 8.41639 3.34311 8.50061 3.34909H13.0443C13.1313 3.34266 13.2182 3.36244 13.2938 3.40588C13.3694 3.44933 13.4303 3.51444 13.4686 3.59282C13.8146 4.19464 14.1757 4.79645 14.5217 5.39826C14.5431 5.44281 14.5777 5.4797 14.6208 5.50392C14.6638 5.52815 14.7133 5.53853 14.7625 5.53367C15.1459 5.51654 15.53 5.52659 15.9119 5.56376C16.2642 5.61331 16.5914 5.77446 16.8454 6.02358C17.0994 6.27269 17.2668 6.59666 17.3232 6.94793C17.3306 6.97495 17.3406 7.00116 17.3533 7.02617V15.8247C17.3533 15.8608 17.3262 15.8969 17.3172 15.933C17.2559 16.2363 17.1136 16.5174 16.9054 16.7462C16.6972 16.9751 16.4308 17.1433 16.1346 17.2329C16.0353 17.269 15.93 17.2871 15.8337 17.3142H1.5256ZM8.68416 6.19867H1.80544C1.65414 6.1858 1.50186 6.20618 1.35928 6.25838C1.21669 6.31058 1.08725 6.39334 0.980023 6.50085C0.872798 6.60836 0.790387 6.73803 0.738568 6.88075C0.686749 7.02348 0.666776 7.17581 0.680048 7.32707V15.4937C0.667031 15.6454 0.687083 15.7982 0.738821 15.9414C0.790559 16.0847 0.872753 16.215 0.979733 16.3234C1.08671 16.4318 1.21594 16.5158 1.35849 16.5694C1.50104 16.623 1.65353 16.6451 1.80544 16.6341H15.5268C15.6798 16.6471 15.8338 16.6263 15.978 16.5733C16.1221 16.5203 16.2529 16.4364 16.361 16.3273C16.4692 16.2183 16.5521 16.0869 16.604 15.9423C16.6559 15.7978 16.6754 15.6436 16.6612 15.4907C16.6612 12.7825 16.6612 10.0563 16.6612 7.34212C16.6676 7.18907 16.6421 7.03636 16.5865 6.89365C16.5308 6.75094 16.4461 6.62133 16.3378 6.51302C16.2295 6.4047 16.0999 6.32004 15.9572 6.26438C15.8145 6.20872 15.6618 6.18327 15.5087 6.18965C13.2399 6.2077 10.965 6.19867 8.68416 6.19867ZM13.7996 5.51261C13.4987 5.02213 13.2369 4.55572 12.957 4.09233C12.9366 4.07197 12.9121 4.0561 12.8851 4.04574C12.8582 4.03538 12.8294 4.03075 12.8006 4.03215H8.73531C8.69418 4.02904 8.65308 4.03863 8.61757 4.05961C8.58206 4.0806 8.55384 4.11197 8.53671 4.1495C8.35617 4.46545 8.1666 4.7814 7.98004 5.09736L7.73329 5.51862L13.7996 5.51261ZM4.32703 5.51261C4.32703 5.35613 4.32703 5.2117 4.32703 5.07328C4.32078 4.93937 4.2648 4.8126 4.17006 4.71776C4.07531 4.62291 3.9486 4.56681 3.81469 4.56042C3.68078 4.55402 3.5493 4.59779 3.44595 4.68318C3.34259 4.76856 3.2748 4.88942 3.25581 5.02213C3.24524 5.18545 3.24524 5.34928 3.25581 5.51261H4.32703Z" fill="white"/><path d="M11.1156 1.21566C11.1156 1.51657 11.1156 1.79039 11.1156 2.07926C11.12 2.1264 11.1146 2.17395 11.0996 2.21886C11.0846 2.26377 11.0604 2.30506 11.0285 2.34007C10.9966 2.37509 10.9578 2.40306 10.9145 2.42221C10.8712 2.44135 10.8244 2.45124 10.777 2.45124C10.7297 2.45124 10.6829 2.44135 10.6396 2.42221C10.5963 2.40306 10.5574 2.37509 10.5256 2.34007C10.4937 2.30506 10.4695 2.26377 10.4545 2.21886C10.4395 2.17395 10.4341 2.1264 10.4385 2.07926C10.4385 1.49851 10.4385 0.917764 10.4385 0.337015C10.4385 0.247633 10.474 0.161912 10.5372 0.0987095C10.6004 0.0355069 10.6862 0 10.7755 0C10.8649 0 10.9506 0.0355069 11.0138 0.0987095C11.077 0.161912 11.1125 0.247633 11.1125 0.337015C11.1336 0.628894 11.1156 0.923783 11.1156 1.21566Z" fill="white"/><path d="M9.49961 2.05223C9.51195 2.12605 9.49981 2.20188 9.46504 2.26816C9.43027 2.33444 9.37478 2.38753 9.30703 2.41933C9.24368 2.45194 9.17138 2.46283 9.10125 2.45032C9.03111 2.43782 8.96703 2.40261 8.91886 2.35012L8.22376 1.65503L7.70921 1.14048C7.67433 1.10986 7.64608 1.07241 7.62621 1.03045C7.60635 0.988497 7.59528 0.942917 7.5937 0.896521C7.59212 0.850126 7.60006 0.803898 7.61702 0.760687C7.63399 0.717476 7.65962 0.678196 7.69234 0.645268C7.72507 0.612339 7.76418 0.58646 7.80729 0.569225C7.85039 0.55199 7.89657 0.543764 7.94297 0.545053C7.98938 0.546342 8.03503 0.55712 8.07711 0.576722C8.11919 0.596325 8.15681 0.624336 8.18765 0.65903C8.58786 1.05623 8.98806 1.45342 9.39128 1.86266C9.43359 1.92209 9.46988 1.9856 9.49961 2.05223Z" fill="white"/><path d="M13.968 0.947861C13.9343 1.01719 13.8918 1.08191 13.8417 1.14044C13.4535 1.54065 13.0563 1.93483 12.6591 2.32601C12.6302 2.36467 12.5933 2.39671 12.551 2.42002C12.5087 2.44333 12.462 2.45736 12.4138 2.46118C12.3657 2.46501 12.3173 2.45853 12.2718 2.44219C12.2264 2.42586 12.185 2.40002 12.1503 2.36642C12.1156 2.33282 12.0885 2.29222 12.0707 2.24732C12.053 2.20241 12.045 2.15424 12.0473 2.10601C12.0496 2.05778 12.0621 2.01059 12.0841 1.96758C12.106 1.92458 12.1369 1.88674 12.1746 1.8566C12.5718 1.45338 12.972 1.05619 13.3783 0.652972C13.4254 0.59824 13.4893 0.560607 13.56 0.545916C13.6308 0.531225 13.7044 0.540299 13.7694 0.571728C13.9079 0.6289 13.971 0.743244 13.968 0.947861Z" fill="white"/><path d="M10.7754 7.14954C11.6289 7.14906 12.4629 7.40476 13.1696 7.88355C13.8762 8.36234 14.4228 9.04218 14.7387 9.8351C15.0547 10.628 15.1254 11.4975 14.9417 12.331C14.758 13.1646 14.3283 13.9238 13.7084 14.5105C13.0884 15.0971 12.3066 15.4842 11.4642 15.6216C10.6218 15.759 9.75755 15.6404 8.98328 15.2812C8.20901 14.922 7.56037 14.3387 7.12131 13.6067C6.68224 12.8748 6.47296 12.0279 6.52055 11.1757C6.56923 10.7423 6.66096 10.315 6.79437 9.89982C6.87261 9.61396 7.05917 9.51767 7.2668 9.59891C7.47442 9.68016 7.52257 9.8607 7.42628 10.1375C7.18184 10.738 7.11146 11.3952 7.22322 12.0338C7.33498 12.6724 7.62435 13.2666 8.05818 13.7484C8.48681 14.29 9.07083 14.6875 9.73186 14.8875C10.3929 15.0876 11.0993 15.0807 11.7563 14.8678C12.4273 14.7016 13.032 14.3356 13.4904 13.8181C13.9487 13.3007 14.2391 12.6562 14.3231 11.9701C14.4188 11.35 14.3506 10.7158 14.1252 10.1303C13.8997 9.54486 13.5249 9.02865 13.038 8.63304C12.5511 8.23743 11.969 7.97621 11.3498 7.87537C10.7306 7.77453 10.0958 7.83759 9.50855 8.05827L9.38217 8.10642C9.34031 8.12289 9.2956 8.13089 9.25062 8.12996C9.20565 8.12903 9.1613 8.11918 9.12016 8.10099C9.07902 8.08279 9.0419 8.05662 9.01094 8.02398C8.97999 7.99134 8.95582 7.95288 8.93984 7.91083C8.92331 7.86826 8.91569 7.82276 8.91745 7.77714C8.9192 7.73151 8.93029 7.68673 8.95003 7.64556C8.96977 7.60439 8.99774 7.5677 9.03221 7.53776C9.06669 7.50783 9.10694 7.48528 9.15047 7.47151C9.60542 7.28766 10.0893 7.18579 10.5798 7.1706L10.7754 7.14954Z" fill="white"/><path d="M13.5559 11.4043C13.5565 11.9545 13.3938 12.4925 13.0885 12.9501C12.7833 13.4078 12.3491 13.7647 11.8409 13.9755C11.3327 14.1863 10.7734 14.2416 10.2338 14.1344C9.69419 14.0272 9.19849 13.7624 8.80947 13.3734C8.42045 12.9843 8.15558 12.4886 8.0484 11.949C7.94121 11.4094 7.99652 10.8501 8.20734 10.3419C8.41815 9.83377 8.77498 9.39956 9.23268 9.09428C9.69037 8.789 10.2283 8.62636 10.7785 8.62695C11.5144 8.62933 12.2194 8.92271 12.7398 9.44306C13.2601 9.9634 13.5535 10.6684 13.5559 11.4043ZM10.7815 9.29798C10.3649 9.29798 9.95767 9.42151 9.61129 9.65296C9.2649 9.88441 8.99493 10.2134 8.8355 10.5983C8.67608 10.9831 8.63436 11.4067 8.71564 11.8152C8.79691 12.2238 8.99752 12.5992 9.2921 12.8937C9.58668 13.1883 9.96199 13.3889 10.3706 13.4702C10.7792 13.5515 11.2027 13.5098 11.5876 13.3503C11.9725 13.1909 12.3014 12.9209 12.5329 12.5745C12.7643 12.2282 12.8879 11.8209 12.8879 11.4043C12.8831 10.8488 12.6591 10.3177 12.2646 9.92657C11.8701 9.53545 11.337 9.31601 10.7815 9.31603V9.29798Z" fill="white"/><path d="M3.79742 8.29895H4.64297C4.68723 8.29796 4.73125 8.3057 4.77251 8.32172C4.81378 8.33775 4.85149 8.36174 4.88348 8.39234C4.91547 8.42294 4.94113 8.45953 4.95898 8.50004C4.97682 8.54055 4.98652 8.58418 4.98751 8.62844C4.9885 8.6727 4.98076 8.71672 4.96473 8.75798C4.94871 8.79925 4.92471 8.83696 4.89412 8.86895C4.86352 8.90094 4.82692 8.9266 4.78641 8.94445C4.7459 8.9623 4.70227 8.97199 4.65802 8.97298C4.08429 8.97298 3.50956 8.97298 2.93382 8.97298C2.88956 8.97179 2.84597 8.9619 2.80554 8.94387C2.7651 8.92584 2.72862 8.90002 2.69816 8.86789C2.6677 8.83575 2.64387 8.79794 2.62803 8.75659C2.61219 8.71525 2.60465 8.67119 2.60583 8.62694C2.60702 8.58268 2.61691 8.53909 2.63494 8.49865C2.65297 8.45822 2.67879 8.42173 2.71093 8.39128C2.74306 8.36082 2.78088 8.33699 2.82222 8.32115C2.86356 8.30531 2.90762 8.29776 2.95188 8.29895H3.79742Z" fill="white"/><path d="M8.33516 8.62998C8.33516 8.67424 8.32645 8.71807 8.30951 8.75895C8.29257 8.79984 8.26775 8.837 8.23645 8.86829C8.20516 8.89958 8.16801 8.92441 8.12712 8.94135C8.08623 8.95828 8.04241 8.967 7.99815 8.967C7.95389 8.967 7.91007 8.95828 7.86918 8.94135C7.82829 8.92441 7.79114 8.89958 7.75984 8.86829C7.72855 8.837 7.70372 8.79984 7.68679 8.75895C7.66985 8.71807 7.66113 8.67424 7.66113 8.62998C7.66113 8.5406 7.69664 8.45488 7.75984 8.39168C7.82305 8.32848 7.90877 8.29297 7.99815 8.29297C8.08753 8.29297 8.17325 8.32848 8.23645 8.39168C8.29966 8.45488 8.33516 8.5406 8.33516 8.62998Z" fill="white"/><path d="M12.1115 11.3441C12.1201 11.3908 12.1189 11.4387 12.1082 11.4848C12.0975 11.531 12.0774 11.5745 12.0492 11.6126C12.021 11.6506 11.9853 11.6825 11.9442 11.7062C11.9032 11.7299 11.8577 11.745 11.8106 11.7504C11.624 11.7654 11.4826 11.63 11.4525 11.4073C11.4518 11.3192 11.4335 11.2322 11.3988 11.1512C11.3641 11.0702 11.3136 10.9969 11.2503 10.9356C11.1871 10.8743 11.1122 10.8262 11.0302 10.794C10.9482 10.7619 10.8606 10.7464 10.7725 10.7484C10.7274 10.7461 10.6832 10.7348 10.6426 10.7151C10.6019 10.6954 10.5657 10.6678 10.5359 10.6338C10.5062 10.5999 10.4835 10.5603 10.4694 10.5174C10.4552 10.4745 10.4498 10.4293 10.4535 10.3843C10.4648 10.2951 10.5104 10.2138 10.5806 10.1576C10.6508 10.1015 10.7401 10.0748 10.8297 10.0834C11.1617 10.097 11.4768 10.2336 11.7137 10.4666C11.9506 10.6996 12.0924 11.0124 12.1115 11.3441Z" fill="white"/></svg>`}
            />
          </View>
        </View>
        <Text
          style={{
            color: "#777",
            fontFamily: "MuseoSans_500",
            fontSize: 16,
            lineHeight: 20,
          }}
        >
          {company && company.field_pb_empresa_titulo}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        {plan.field_pb_oferta_direccion && (
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 15,
              alignItems: "center",
            }}
          >
            <IconSvg
              width="18"
              height="26"
              icon={`<svg width="18" height="26" viewBox="0 0 18 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.81156 25.6209C8.60304 25.45 8.4113 25.2595 8.23897 25.052C6.72569 22.8947 5.20332 20.7419 3.73094 18.5528C2.48799 16.763 1.47711 14.8222 0.722566 12.7772C0.242954 11.4998 -0.00184317 10.146 1.04483e-05 8.78122C0.0586328 6.60994 0.897166 4.53266 2.36172 2.93063C3.82627 1.3286 5.81858 0.309286 7.97302 0.059767C10.1275 -0.189752 12.2995 0.347262 14.0904 1.57225C15.8814 2.79724 17.1712 4.62803 17.7231 6.7286C18.1726 8.58286 18.0732 10.5281 17.4368 12.3267C16.7749 14.316 15.8421 16.2044 14.6647 17.9384C13.3241 19.9728 11.9108 21.9571 10.5293 23.9642C10.2794 24.3283 10.0431 24.7061 9.77042 25.0565C9.59215 25.2571 9.40087 25.4456 9.19783 25.6209H8.81156ZM9.00242 23.5182C9.03345 23.4868 9.06229 23.4534 9.08877 23.4181C10.4748 21.4201 11.8836 19.4448 13.2287 17.4241C14.3939 15.7375 15.3249 13.9002 15.9962 11.9626C16.532 10.5074 16.6547 8.93204 16.3507 7.41129C15.9459 5.49163 14.8084 3.80628 13.1806 2.7146C11.5528 1.62292 9.56363 1.2113 7.63715 1.56749C5.71068 1.92369 3.99936 3.01952 2.8681 4.62133C1.73684 6.22314 1.27514 8.20419 1.58145 10.1421C1.82035 11.5045 2.25668 12.8246 2.8766 14.0607C3.90979 16.1202 5.11213 18.0901 6.4712 19.95C7.30737 21.1288 8.14808 22.3076 9.00242 23.5182Z" fill="#354999"/><path d="M9.03418 4.46206C9.92406 4.47017 10.7916 4.74214 11.5273 5.24364C12.2629 5.74515 12.8338 6.4537 13.1677 7.27985C13.5016 8.106 13.5836 9.01271 13.4034 9.88551C13.2232 10.7583 12.7888 11.5581 12.1551 12.1838C11.5215 12.8096 10.7168 13.2333 9.84291 13.4015C8.96898 13.5696 8.06489 13.4747 7.24477 13.1287C6.42466 12.7826 5.7253 12.201 5.23498 11.4572C4.74465 10.7135 4.48535 9.84086 4.4898 8.94961C4.49337 8.35593 4.61381 7.76879 4.84423 7.2218C5.07465 6.6748 5.41053 6.17869 5.83264 5.76186C6.25475 5.34503 6.75479 5.01567 7.30416 4.79263C7.85352 4.5696 8.44141 4.45726 9.03418 4.46206ZM9.01146 5.96398C8.41755 5.96398 7.83697 6.1403 7.34309 6.47067C6.84921 6.80103 6.4642 7.27061 6.23672 7.82006C6.00923 8.3695 5.94948 8.97415 6.06501 9.5576C6.18055 10.141 6.46619 10.6771 6.88583 11.098C7.30546 11.5189 7.84027 11.8058 8.42266 11.9224C9.00505 12.039 9.60887 11.9801 10.1578 11.7531C10.7068 11.5261 11.1762 11.1412 11.5068 10.647C11.8375 10.1529 12.0144 9.57172 12.0153 8.97691C12.0141 8.17899 11.6974 7.41402 11.1344 6.84938C10.5715 6.28474 9.80817 5.96638 9.01146 5.96398Z" fill="#354999"/></svg>`}
            />

            <Text
              style={[
                { color: "#777", fontFamily: "MuseoSans_500", fontSize: 16 },
              ]}
            >
              {plan.field_pb_oferta_direccion}
            </Text>
          </View>
        )}

        <Text
          style={{
            textAlign: "left",
            color: "#777",
            fontFamily: "MuseoSans_500",
            fontSize: 16,
            lineHeight: 20,
            marginBottom: 5,
            marginTop: 5,
          }}
        >
          {plan.field_pb_oferta_desc_corta}
        </Text>
        <RenderHTML
          contentWidth={windowWidth}
          source={source}
          tagsStyles={tagsStyles}
          renderersProps={{
            img: {
              enableExperimentalPercentWidth: true,
            },
          }}
        />

        <Pressable
          onPress={() => {
            Linking.openURL(
              `https://visitbogota.co/g/booklink/?url=${company.field_pb_empresa_direccion}&id=${id}&price=${plan.field_pd}`
            );
          }}
          style={{
            backgroundColor: "#354999",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            padding: 15,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              color: Colors.white,
              fontFamily: "MuseoSans_500",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            {wordsLanguage[actualLanguage][38]}
          </Text>
        </Pressable>
      </View>

      <Carousel
        loop={true}
        width={430}
        height={(windowWidth / 16) * 9}
        snapEnabled={true}
        pagingEnabled={true}
        data={imagesData}
        style={{ width: "100%" }}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item.uri }}
            style={styles.imageBackground}
          >
            <Image source={{ uri: item.uri }} style={styles.image} />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "rgba(0,0,0,.5)",
                padding: 10,
              }}
            ></View>
          </ImageBackground>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontFamily: "MuseoSans_500",
    fontSize: 25,
    textShadowColor: "rgba(0, 0, 0, .7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 15,
  },
  container: {
    flexDirection: "row", // Para que los Text se muestren en línea
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  firstLetter: {
    fontFamily: "MuseoSans_500",
    fontSize: 33, // Establece el tamaño de la primera letra
    color: "#777777", // Establece el color de la primera letra
    // Agrega otros estilos según tus preferencias
  },
  imageGallery: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageContainer: {
    width: "50%", // You can adjust the width as needed
    aspectRatio: 1, // Maintain aspect ratio (1:1)
    padding: 5,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default SinglePlan;
