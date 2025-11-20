import * as Location from "expo-location";
import * as Updates from "expo-updates";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ImageBackground, Platform, Text } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Provider, useDispatch } from "react-redux";
import { store } from "../src/store";
import { setLocation } from "../src/store/actions";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      // alert(`Error fetching latest Expo update: ${error}`);
    }
  }

  const [fontsLoaded] = useFonts({
    MuseoSans_100: require("../assets/fonts/MuseoSans-100.ttf"),
    MuseoSans_500: require("../assets/fonts/MuseoSans-500.ttf"),
    MuseoSans_700: require("../assets/fonts/MuseoSans-700.ttf"),
    MuseoSans_900: require("../assets/fonts/MuseoSans-900.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  React.useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  if (!fontsLoaded) {
    return (
      <ImageBackground
       source={require('../assets/splash.png')}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-end",
          paddingVertical: 80,
          paddingHorizontal: 20,
        }}
      ></ImageBackground>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <RootLayoutNav />
      </Provider>
    </SafeAreaView>
  );
}

function RootLayoutNav() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      dispatch(setLocation(location));
    })();
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}></Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
