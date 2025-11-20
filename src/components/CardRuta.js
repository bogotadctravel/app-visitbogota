import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { windowWidth } from "../constants/ScreenWidth";
import { Colors } from "../constants";
import RenderHtml from "react-native-render-html";

const CardRuta = ({ image, title, desc, onPress }) => {
  const { width } = useWindowDimensions();
  const source = {
    html: desc,
  };

  const tagsStyles = {
    p: {
      textAlign: "justify",
      paddingHorizontal: 10,
    },
  };
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: "#FFF",
          width: windowWidth - 120,
          opacity: pressed ? 0.5 : 1,
          borderRadius: 10,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
        },
      ]}
    >
      <ImageBackground
        style={[
          {
            height: 150,
            alignItems: "center",
            justifyContent: "flex-end",
            padding: 10,
          },
        ]}
        source={{ uri: image }}
        onLoad={handleImageLoad}
      >
        <Text
          style={{
            color: Colors.white,
            fontFamily: "MuseoSans_700",
            fontSize: 20,
            textShadowColor: "rgba(0, 0, 0, .7)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 10,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      </ImageBackground>
      <RenderHtml
        baseStyle={{ flex: 1 }}
        contentWidth={width}
        source={source}
        tagsStyles={tagsStyles}
      />
      <View
        style={{
          backgroundColor: Colors.orange,
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 14,
            textAlign: "center",
            fontFamily: "MuseoSans_700",
          }}
        >
          Ver más
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default CardRuta;
