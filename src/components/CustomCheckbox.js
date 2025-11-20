import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
export const CustomCheckbox = ({
  onPress,
  checked,
  styleText,
  light,
  ...props
}) => {
  return (
    <Pressable onPress={onPress} style={props.style}>
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        <View
          style={
            checked
              ? {
                  ...styles.checkbox,
                  ...styles.filled,
                  borderColor: light ? "#FFF" : "#333",
                }
              : { ...styles.checkbox, borderColor: light ? "#FFF" : "#333" }
          }
        >
          {checked && <Entypo name="check" size={8} color="#FFF" />}
        </View>
        <Text
          style={[
            {
              fontFamily: "MuseoSans_500",
              fontSize: 14,
              lineHeight: 16,
              color: light ? "#FFF" : "#55637E",
              ...styleText,
            },
          ]}
        >
          {props.label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,

    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginRight: 10,
    width: 16,
    height: 16,
  },
  filled: {
    borderWidth: 0,
    backgroundColor: "#354999",
  },
});

export default CustomCheckbox;
