import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  FlatList,
  Keyboard,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { fetchBogotaDrplV2 } from "../../src/api/imperdibles";
import CardAtractivo from "../../src/components/CardAtractivo";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import {
  selectActualLanguage,
  selectWordsLang,
} from "../../src/store/selectors";
import IconSvg from "../../src/components/IconSvg";

export default function Page() {
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const [searchValue, setSearchValue] = React.useState("");
  const [viewResponse, setViewResponse] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);

  const searchBogota = async () => {
    if (searchValue) {
      const data = await fetchBogotaDrplV2(
        `/search/${searchValue}`,
        actualLanguage
      );
      setSearchResults(data);
      setViewResponse(true);
      Keyboard.dismiss();
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://visitbogota.co/assets_app/searchbg.png" }}
      style={{ flex: 1 }}
      blurRadius={5}
    >
      <View style={[styles.container]}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 20,
              alignItems: "center",
              backgroundColor: "#F1F1F1",
            }}
          >
            <View
              style={{
                backgroundColor: "#D9D9D9",
                padding: 13,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            >
              <IconSvg
                width="20"
                height="20"
                icon={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.6905 18.1961L15.0599 13.576C16.2158 12.106 16.8424 10.2893 16.8385 8.41924C16.8385 6.75407 16.3447 5.1263 15.4196 3.74176C14.4945 2.35723 13.1796 1.27811 11.6411 0.64088C10.1027 0.00364788 8.4099 -0.163081 6.77673 0.161777C5.14356 0.486635 3.64339 1.28849 2.46594 2.46594C1.28849 3.64339 0.486635 5.14356 0.161777 6.77673C-0.163081 8.4099 0.00364788 10.1027 0.64088 11.6411C1.27811 13.1796 2.35723 14.4945 3.74176 15.4196C5.1263 16.3447 6.75407 16.8385 8.41924 16.8385C10.2893 16.8424 12.106 16.2158 13.576 15.0599L18.1961 19.6905C18.3943 19.8887 18.663 20 18.9433 20C19.2235 20 19.4923 19.8887 19.6905 19.6905C19.8887 19.4923 20 19.2235 20 18.9433C20 18.663 19.8887 18.3943 19.6905 18.1961ZM3.95705 12.9341C2.91185 11.912 2.25366 10.5589 2.09478 9.10571C1.93589 7.6525 2.28615 6.18918 3.0858 4.9654C3.88545 3.74163 5.08494 2.83322 6.47964 2.39516C7.87433 1.9571 9.37781 2.01653 10.7336 2.56331C12.0893 3.11009 13.2134 4.11035 13.9139 5.39343C14.6145 6.67651 14.8482 8.16291 14.5751 9.59904C14.302 11.0352 13.539 12.3321 12.4164 13.2684C11.2938 14.2048 9.88107 14.7227 8.41924 14.7337C6.74512 14.7322 5.1401 14.066 3.95705 12.8814V12.9341Z" fill="#354999"/></svg>`}
              />
            </View>
            <TextInput
              value={searchValue}
              onChangeText={setSearchValue}
              onSubmitEditing={searchBogota}
              placeholder={`${wordsLanguage[actualLanguage][14]}...`}
              style={{
                flex: 1,
                fontSize: 16,
                color: "#000",
                backgroundColor: "#F1F1F1",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
                padding: 8,
              }}
              placeholderTextColor="#000"
            />
          </View>
          {/* <Pressable
          onPress={searchBogota}
          style={{
            backgroundColor: "#FFF",
            
            paddingVertical: 8,
            marginBottom: 20,
            paddingHorizontal: 16,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#354999",
              fontSize: 18,
              fontFamily: "MuseoSans_500",
            }}
          >
            {wordsLanguage[actualLanguage][14]}
          </Text>
        </Pressable> */}
        </View>
        {viewResponse && (
          <Text
            style={{
              fontSize: 22,
              fontFamily: "MuseoSans_500",
              textAlign: "center",
              color: "#FFF",
              marginBottom: 30,
            }}
          >
            {wordsLanguage[actualLanguage][15]} "{searchValue}"
          </Text>
        )}

        {viewResponse && (
          <FlatList
            numColumns={2}
            style={{ marginBottom: 30 }}
            contentContainerStyle={{
              overflow: "hidden",
            }}
            ItemSeparatorComponent={() => (
              <View style={{ paddingHorizontal: 2 }} />
            )}
            data={searchResults}
            keyExtractor={(item) => item.nid}
            fadingEdgeLength={15}
            renderItem={({ item }) => {
              return (
                <CardAtractivo
                  isHorizontal
                  title={item.title}
                  onPress={() => {
                    switch (item.type) {
                      case "Atractivos":
                        return router.push(`(tabs)/atractivos/${item.nid}`);
                      case "PB - Ofertas":
                        return router.push(`(tabs)/planes/${item.nid}`);
                      case "Atractivo":
                        return router.push(`(tabs)/atractivos/${item.nid}`);

                      case "Alrededor":
                        return router.push(`(tabs)/atractivos/${item.nid}`);

                      case "Artículo":
                        return router.push(`(tabs)/blog/${item.nid}`);

                      case "Eventos":
                        return router.push(`(tabs)/events/${item.nid}`);

                      default:
                        router.push("");
                    }
                  }}
                  subtitle={(() => {
                    switch (item.type) {
                      case "Atractivos":
                        return "Atractivo";
                      case "PB - Ofertas":
                        return "Oferta";
                      case "Atractivo":
                        return "Atractivo";

                      case "Alrededor":
                        return "Más allá de Bogota";

                      case "Artículo":
                        return "Blog";

                      case "Eventos":
                        return "Evento";

                      default:
                        return "";
                    }
                  })()}
                  image={`https://files.visitbogota.co${
                    item.field_imagen_listado_events ||
                    item.field_img_portal ||
                    item.field_cover_image ||
                    item.field_pb_oferta_img_listado ||
                    item.field_image ||
                    "/img/noimg.png" // Ruta de una imagen de respaldo en caso de que todos los campos estén vacíos
                  }`}
                />
              );
            }}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
