import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { windowWidth } from "../constants/ScreenWidth";
import { Colors } from "../constants";

const CardAtractivo = ({
  image,
  title,
  isHorizontal,
  onPress,
  subtitle,
  isAudioGuide,
  start,
  end,
}) => {
  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };
  let monthStart, dayStart, yearStart;
  let monthEnd, dayEnd, yearEnd;
  if (start) {
    const dateStart = new Date(start);
    const optionsdateStart = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const dateFormatteddateStart = dateStart.toLocaleDateString(
      actualLanguage == "es" ? "es-ES" : "en-US",
      optionsdateStart
    );
    monthStart = dateFormatteddateStart.substring(0, 3);
    dayStart = dateFormatteddateStart.substring(4, 6);
    yearStart = dateFormatteddateStart.substring(7);
  }
  if (end) {
    const dateEnd = new Date(end);
    const optionsdateEnd = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const dateFormatteddateEnd = dateEnd.toLocaleDateString(
      actualLanguage == "es" ? "es-ES" : "en-US",
      optionsdateEnd
    );

    monthEnd = dateFormatteddateEnd.substring(0, 3);
    dayEnd = dateFormatteddateEnd.substring(4, 6);
    yearEnd = dateFormatteddateEnd.substring(7);
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        isHorizontal
          ? { width: windowWidth / 2 - 20 }
          : { width: windowWidth - 40 },
        {
          justifyContent: "flex-end",
          opacity: pressed ? 0.5 : 1,
        },
      ]}
    >
      <ImageBackground
        style={[
          {
            height: 150,
            alignItems: "center",
            justifyContent: isAudioGuide ? "center" : "flex-end",
            padding: 10,
          },
        ]}
        source={{ uri: image }}
        onLoad={handleImageLoad}
      >
        {isAudioGuide && (
          <FontAwesome5 name="headphones" size={50} color="white" />
        )}
        <Text
          style={{
            color: Colors.white,
            fontFamily: "MuseoSans_500",
            fontSize: 16,
            textShadowColor: "rgba(0, 0, 0, .7)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 10,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              color: Colors.white,
              fontFamily: "MuseoSans_500",
              fontSize: 12,
              textShadowColor: "rgba(0, 0, 0, .7)",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 10,
              marginTop: 10,
              textAlign: "center",
            }}
          >
            {subtitle}
          </Text>
        )}
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default CardAtractivo;
