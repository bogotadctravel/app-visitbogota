import * as Location from "expo-location";
import * as SplashScreen from "expo-splash-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [location, setLocation] = React.useState(null);

  const [fontsLoaded] = useFonts({
    MuseoSans_100: require("./assets/fonts/MuseoSans-100.ttf"),
    MuseoSans_500: require("./assets/fonts/MuseoSans-500.ttf"),
    MuseoSans_700: require("./assets/fonts/MuseoSans-700.ttf"),
    MuseoSans_900: require("./assets/fonts/MuseoSans-900.ttf"),
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <ImageBackground
        source={require("./assets/images/atardecer.png")}
        style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
      >
        <Text>Te damos la bienvenida a BOGOTÁ </Text>
        <Text>¡Empieza a vivirla!</Text>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <View style={styles.container} onLayout={onLayoutRootView}></View>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
