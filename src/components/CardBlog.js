import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { windowHeight, windowWidth } from "../constants/ScreenWidth";
import { Colors } from "../constants";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";

const CardBlog = ({ image, title, onPress, intro, isHorizontal }) => {
  const systemFonts = [...defaultSystemFonts, "MuseoSans_700", "MuseoSans_900"];

  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };
  const source = {
    html: intro,
  };

  const tagsStyles = {
    p: {
      textAlign: "left",
      color: "#FFF",
      fontSize: 22,
      fontFamily: "MuseoSans_500",
    },
  };
  function decodeSpecialChars(str) {
    return str
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&cent;/g, '¢')
      .replace(/&pound;/g, '£')
      .replace(/&yen;/g, '¥')
      .replace(/&euro;/g, '€')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™');
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: isHorizontal ? windowWidth - 40 : windowWidth,
          opacity: pressed ? 0.5 : 1,
          height:  Platform.OS === "ios" ? windowHeight - 400 : windowHeight - 320,
        },
      ]}
    >
      <ImageBackground
        style={[
          {
            height:  Platform.OS === "ios" ? windowHeight - 400 : windowHeight - 320,
          },
          isHorizontal && {  overflow: "hidden" },
        ]}
        source={{ uri: image }}
        onLoad={handleImageLoad}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,.3)",
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
                textShadowColor: "rgba(0, 0, 0, .7)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 10,
                marginBottom:10
              }}
            >
              {decodeSpecialChars(title)}
            </Text>
            {/* <Text
              style={{
                color: Colors.white,
                fontFamily: "MuseoSans_500",
                fontSize: 14,
              }}
            >
              {intro}
            </Text> */}
        </View>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default CardBlog;
