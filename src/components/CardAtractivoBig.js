import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  Platform,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { windowHeight, windowWidth } from "../constants/ScreenWidth";
import { Colors } from "../constants";
import { LinearGradient } from "expo-linear-gradient";

const CardAtractivoBig = ({ image, title, onPress, atractivo }) => {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          justifyContent: "flex-end",
          opacity: pressed ? 0.5 : 1,
          width: windowWidth - 100,
          overflow: "hidden",
          height:
            Platform.OS === "ios" ? windowHeight - 450 : windowHeight - 320,
        },
      ]}
    >
      <ImageBackground
        style={[
          {
            flex: 1,
            overflow: "hidden",
          },
        ]}
        source={{ uri: image }}
        onLoad={handleImageLoad}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,.7)"]}
          style={{
            flex: 1,
            justifyContent: "center",
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors.white,
              fontFamily: "MuseoSans_500",
              fontSize: 25,
            }}
          >
            {title}
          </Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default CardAtractivoBig;
