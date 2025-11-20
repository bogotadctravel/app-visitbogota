import React from "react";
import { StyleSheet, Text, ImageBackground, Pressable } from "react-native";
import { windowWidth } from "../constants/ScreenWidth";

const CardInfo = (props) => {
  return (
    <Pressable onPress={props.onPress}>
      <ImageBackground
        style={{
          width: windowWidth / 2 - 30,
          height: windowWidth / 2 - 30,
          overflow: "hidden",
          alignItems: "center",
          borderRadius: 8,
          justifyContent: "flex-end",
          padding: 5,
        }}
        source={{
          uri: `https://files.visitbogota.co${props.item.field_image}`,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontFamily: "MuseoSans_500",
            fontSize: 16,
            textAlign: "center",
            textShadowColor: "rgba(0,0,0,.5)",
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 5,
          }}
        >
          {props.item.title}
        </Text>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default CardInfo;
