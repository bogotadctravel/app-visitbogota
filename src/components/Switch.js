import { View, Text, Pressable } from "react-native";
import React from "react";
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";
import { Colors } from "../constants";

export default Switch = ({ size, onPress, isActive }) => {
  const trackWidth = React.useMemo(() => {
    return size;
  });
  const trackHeight = React.useMemo(() => {
    return size * 0.4;
  });
  const knobSize = React.useMemo(() => {
    return size * 0.5;
  });
  const transition = {
    type: "timing",
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  };
  return (
    <Pressable
      onPress={onPress}
      style={{
        marginVertical: 30,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {/* // track */}
        <MotiView
          from={{
            backgroundColor: isActive ? Colors.grayBg : Colors.orange,
          }}
          animate={{
            backgroundColor: isActive ? Colors.orange : Colors.grayBg,
          }}
          transition={transition}
          style={{
            width: trackWidth,
            position: "absolute",
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: Colors.orange,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 3,
          }}
        ></MotiView>
        {/* // Knob */}
        <MotiView
          animate={{
            translateX: isActive ? trackWidth / 4 : -trackWidth / 4,
          }}
          transition={transition}
          style={{
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            backgroundColor: "#FFF",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        ></MotiView>
      </View>
      <Text
        style={{
          color: Colors.orange,
          fontSize: 12,
          fontFamily: "MuseoSans_500",
          marginVertical: 5,
        }}
      >
        Cerca de mi
      </Text>
    </Pressable>
  );
};
