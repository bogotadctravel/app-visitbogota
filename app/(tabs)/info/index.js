import * as WebBrowser from "expo-web-browser";
import React from "react";
import VideoPlayer from "../../../src/components/VideoPlayer";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { windowWidth } from "../../../src/constants/ScreenWidth";
import {
  Accordion,
  CardInfo,
  PreloaderComponent,
} from "../../../src/components";
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  ScrollView,
  ImageBackground,
  Pressable,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import {
  fetchBogotaDrpl,
  fetchBogotaDrplV2,
} from "../../../src/api/imperdibles";
import {
  selectActualLanguage,
  selectWordsLang,
} from "../../../src/store/selectors";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";

const info = (props) => {
  const [faqs, setFaqs] = React.useState([]);
  const [infoUtil, setInfoUtil] = React.useState([]);
  const [modalInfoVisible, setModalInfoVisible] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [signlang, setSignlang] = React.useState([]);
  const [videoSource, setVideoSource] = React.useState("");
  const actualLanguage = useSelector(selectActualLanguage);
  const wordsLanguage = useSelector(selectWordsLang);
  // Variable de estado para controlar si las consultas han finalizado
  const [queriesCompleted, setQueriesCompleted] = React.useState(false);
  const [infoSelected, setInfoSelected] = React.useState({
    title: "",
    field_download_file: "",
    body: "",
    field_cat_rel: "",
    field_address: "",
    field_image: "",
    nid: "",
    field_mini_img: "",
  });

  const customOrder = ["1", "250", "2", "3", "251"];

  // Función de comparación para ordenar
  function cmp(a, b) {
    const posA = customOrder.indexOf(a.tid);
    const posB = customOrder.indexOf(b.tid);
    return posA - posB;
  }
  React.useEffect(() => {
    Promise.all([
      fetchBogotaDrpl("/signlang/all").then((data) =>
        data.filter((d) => d.field_imagen !== "")
      ),

      fetchBogotaDrplV2(`/tripinfocat/faq`).then((data) =>
        Promise.all(
          data.map((cat) =>
            fetchBogotaDrpl(`/faq/${cat.tid}`, actualLanguage).then(
              (elements) =>
                elements.length > 0
                  ? {
                      tid: cat.tid,
                      title: cat.name,
                      elements,
                    }
                  : null
            )
          )
        ).then((organizedData) => organizedData.filter((item) => item !== null))
      ),

      fetchBogotaDrplV2("/tripinfocat/cat_help_info", actualLanguage).then(
        (data) => {
          return Promise.all(
            data.map((cat) =>
              fetchBogotaDrplV2(
                `/tripinfoapp/${cat.tid}/all`,
                actualLanguage
              ).then((elements) => ({
                tid: cat.tid,
                title: cat.name,
                elements,
              }))
            )
          );
        }
      ),
    ])
      .then(([signlangData, faqData, infoData]) => {
        // Actualizar el estado con la información correspondiente
        setSignlang(signlangData);
        setFaqs(faqData);
        setInfoUtil(infoData);

        // Marcar que las consultas han finalizado
        setQueriesCompleted(true);
      })
      .catch((error) => console.error(error));
  }, [actualLanguage]);
  if (!queriesCompleted) {
    return <PreloaderComponent />;
  }

  const tagsStyles = {
    p: {
      textAlign: "justify",
      color: "#333",
      fontFamily: "MuseoSans_500",
      fontSize: 16,
    },
  };
  const systemFonts = [...defaultSystemFonts, "MuseoSans_700", "MuseoSans_900"];

  return (
    <ScrollView
      style={{
        height: Dimensions.get("window").height,
      }}
      contentContainerStyle={{
        backgroundColor: "#FFF",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalInfoVisible}
        onRequestClose={setModalInfoVisible}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              height: "90%",
              overflow: "hidden",
              width: "100%",
            }}
          >
            <ImageBackground
              style={{
                alignItems: "center",
                justifyContent: "flex-end",
                height: (windowWidth / 16) * 9,
                padding: 20,
                width: windowWidth,
                position: "relative",
              }}
              source={{
                uri: `https://files.visitbogota.co${infoSelected.field_image}`,
              }}
            >
              <Pressable
                onPress={() => setModalInfoVisible(false)}
                style={{ position: "absolute", right: 15, top: 15 }}
              >
                <Ionicons name="close" size={35} color="#354999" />
              </Pressable>
              <Text
                style={{
                  color: "#FFF",
                  fontFamily: "MuseoSans_500",
                  fontSize: 25,
                  textAlign: "center",
                  textShadowColor: "rgba(0,0,0,.5)",
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 5,
                }}
              >
                {infoSelected.title}
              </Text>
            </ImageBackground>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <RenderHTML
                contentWidth={windowWidth}
                source={{
                  html: infoSelected.body,
                }}
                systemFonts={systemFonts}
                tagsStyles={tagsStyles}
              />

              {infoSelected.field_address && (
                <Text
                  style={{
                    color: "#333",
                    fontFamily: "MuseoSans_500",
                    fontSize: 16,
                  }}
                >
                  {infoSelected.field_address}
                </Text>
              )}
              {infoSelected.field_download_file && (
                <Pressable
                  onPress={() =>
                    WebBrowser.openBrowserAsync(
                      `https://files.visitbogota.co${infoSelected.field_download_file}`
                    )
                  }
                >
                  <Text
                    style={{
                      color: "#354999",
                      fontFamily: "MuseoSans_500",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {actualLanguage == "es"
                      ? "Descargar Adjunto"
                      : "Download file"}
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: "#354999",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          flexDirection: "row",
          gap: 15,
          marginBottom: 30,
        }}
      >
        <Octicons name="info" size={24} color="#FFF" />
        <Text
          style={{
            color: "#FFF",
            fontFamily: "MuseoSans_500",
            fontSize: 30,
            textAlign: "center",
          }}
        >
          {wordsLanguage[actualLanguage][7]}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ paddingHorizontal: 20 }}>
          {infoUtil
            .filter((item) => item.elements && item.elements.length > 0) // 👈 evita categorías vacías
            .sort(cmp)
            .map((item) => (
              <View key={item.tid} style={{ marginBottom: 30 }}>
                <Text
                  style={{
                    color: "#333",
                    fontFamily: "MuseoSans_500",
                    fontSize: 30,
                    marginBottom: 15,
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Text>
                <FlatList
                  horizontal
                  data={item.elements}
                  ItemSeparatorComponent={() => (
                    <View style={{ marginHorizontal: 3 }} />
                  )}
                  fadingEdgeLength={25}
                  keyExtractor={(element) => element.nid}
                  renderItem={({ item: element }) => (
                    <CardInfo
                      item={element}
                      onPress={() => {
                        setInfoSelected(element);
                        setModalInfoVisible(true);
                      }}
                    />
                  )}
                />
              </View>
            ))}
        </View>
      </View>
      <VideoPlayer
        videoSource={videoSource}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default info;
