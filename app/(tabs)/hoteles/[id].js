import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Colors } from "../../../src/constants";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ComoLlegar,
  PreloaderComponent,
  ReadMoreText,
} from "../../../src/components";
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles";
import { useLocalSearchParams } from "expo-router";
import { windowWidth } from "../../../src/constants/ScreenWidth";
import { selectActualLanguage } from "../../../src/store/selectors";
import { useSelector } from "react-redux";

const SingleHotel = () => {
  const { id } = useLocalSearchParams();
  const [hotel, setHotel] = React.useState(null);
  const actualLanguage = useSelector(selectActualLanguage);

  const getSingleHotel = async () => {
    const data = await fetchBogotaDrplV2(
      `/hotels/${id}/all/all/all/all`,
      actualLanguage
    );
    setHotel(data[0]);
  };

  React.useEffect(() => {
    getSingleHotel();
  }, []);

  if (!hotel) {
    return <PreloaderComponent />;
  }
  const imagesData = hotel.field_galery?.split(",")?.map((img, index) => ({
    uri: `https://files.visitbogota.co${img.trim()}`,
    alt: atractivo.field_galery_1?.split(",")[index] || "",
  }));
  return (
    <ScrollView>
      <ImageBackground
        style={{
          width: windowWidth,
          height: windowWidth - 120,
        }}
        source={{
          uri: `https://files.visitbogota.co${
            hotel.field_img ? hotel.field_img : "/img/noimg.png"
          }`,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
            flex: 1,
            padding: 20,
            justifyContent: "flex-end",
          }}
        >
          <Text style={styles.text}>{hotel.title}</Text>
        </View>
      </ImageBackground>
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        {hotel.field_hadress && (
          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync(
                `https://www.google.com/maps/search/?api=1&query=${hotel.field_location.trim()}`
              )
            }
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="map-marker" size={22} color="#354999" />
            <Text
              style={[
                { color: "#777", fontFamily: "MuseoSans_500", fontSize: 16 },
              ]}
            >
              {hotel.field_hadress}
            </Text>
          </Pressable>
        )}
        {hotel.field_htel && (
          <Pressable
            onPress={() => Linking.openURL(`tel:${hotel.field_htel}`)}
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome name="phone" size={24} color="#354999" />
            <Text
              style={[
                { color: "#777", fontFamily: "MuseoSans_500", fontSize: 16 },
              ]}
            >
              {hotel.field_htel}
            </Text>
          </Pressable>
        )}
        {hotel.field_hweb && (
          <Pressable
            onPress={() =>
              WebBrowser.openBrowserAsync(`${atractivo.field_hweb}`)
            }
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons name="web" size={22} color="#58bf9c" />

            <Text
              style={[
                { color: "#777", fontFamily: "MuseoSans_500", fontSize: 16 },
              ]}
            >
              {hotel.field_hweb}
            </Text>
          </Pressable>
        )}
        {hotel.field_desc && (
          <ReadMoreText text={hotel.field_desc} maxLines={3} />
        )}
      </View>
      {hotel.field_location && (
        <ComoLlegar
          onPress={() =>
            WebBrowser.openBrowserAsync(
              `https://www.google.com/maps/search/?api=1&query=${hotel.field_location.trim()}`
            )
          }
        />
      )}
      {hotel.field_galery && (
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
              >
                {/* <Text style={{ color: "#FFF", fontFamily: "MuseoSans_700" }}>
          {item.alt}
        </Text> */}
              </View>
            </ImageBackground>
          )}
        />
      )}
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

export default SingleHotel;
