import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import Colors from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

const Accordion = ({ title, children, small, colorTitle }) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Dimensions.get("window").width / 2],
  });

  const toggleAccordion = () => {
    const finalValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.timing(animation, {
      toValue: finalValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.titleContainer} onPress={toggleAccordion}>
        <Text
          style={[
            styles.title,
            {
              color: colorTitle ? colorTitle : "#354999",
              fontSize: small ? 16 : 20,
            },
          ]}
        >
          {title}
        </Text>
        <Animated.View
          style={{
            transform: [{ rotate }],
            backgroundColor: colorTitle ? colorTitle : "#354999",
            borderRadius: 30 * 2,
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome name="plus" size={20} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.content, { maxHeight: contentHeight }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    flex: 1,
    textAlign: "center",

    fontFamily: "MuseoSans_500",
  },
  content: {
    paddingHorizontal: 15,
  },
});

export default Accordion;
