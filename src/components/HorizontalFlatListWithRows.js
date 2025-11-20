import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ImageBackground,
  Pressable,
  Text,
} from "react-native";
import { windowHeight, windowWidth } from "../constants/ScreenWidth";
import { Colors } from "../constants";
import { number_format, truncateString } from "../api/imperdibles";
import { router } from "expo-router";

const itemsPerRow = 3;

const HorizontalFlatListWithRows = ({ data }) => {
  const rows = [];
  for (let i = 0; i < Math.ceil(data.length / itemsPerRow); i++) {
    const start = i * itemsPerRow;
    const end = Math.min(start + itemsPerRow, data.length);
    rows.push(data.slice(start, end));
  }

  const renderRow = ({ item }) => {
    return <></>;
  };

  return (
    <FlatList
      data={rows}
      renderItem={renderRow}
      keyExtractor={(item, index) => `row_${index}`}
      horizontal
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
});

export default HorizontalFlatListWithRows;
