import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { fetchAllWords, setLanguage } from "../src/store/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IconSvg from "../src/components/IconSvg";

const logoWhite = require("../assets/images/logo_blue.png");
const LoadingScreen = () => {
  const [time, setTime] = useState(new Date().getTime());
  return (
    <ImageBackground
   source={require('../assets/splash.png')}
      style={styles.background}
    ></ImageBackground>
  );
};

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const setActualLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem("userLanguage", lang);
      dispatch(setLanguage(lang));
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error saving language to AsyncStorage", error);
    }
  };

  useEffect(() => {
  (async () => {

    try {
      const storedLanguage = await AsyncStorage.getItem("userLanguage");
      const language = storedLanguage || "es";

      await dispatch(setLanguage(language));
      await dispatch(fetchAllWords(language));
      if (storedLanguage) {
        router.push("/(tabs)");
      }
    } catch (error) {
      console.error("Error retrieving language from AsyncStorage", error);
    } finally {
      setIsLoading(false);
    }
  })();
}, [dispatch]);


  let arrayAvailableLanguages = [
    {
      name: "Español",
      flag: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.9767 24.6576H12.364C5.56825 24.6576 0.0224126 19.2109 6.7276e-05 12.5073C-0.00526234 10.903 0.306118 9.31329 0.916359 7.82948C1.5266 6.34567 2.4237 4.99689 3.55623 3.86047C4.68876 2.72404 6.03445 1.82232 7.51616 1.20699C8.99787 0.591666 10.5865 0.274833 12.1909 0.274658L12.2327 0.274658C18.9364 0.297004 24.383 5.84284 24.383 12.6386V22.2513C24.3823 22.8893 24.1285 23.5009 23.6774 23.952C23.2263 24.4031 22.6147 24.6569 21.9767 24.6576ZM12.1909 1.53158C10.7518 1.53158 9.32694 1.81563 7.99792 2.36747C6.6689 2.9193 5.46188 3.72806 4.44608 4.74736C3.43029 5.76666 2.62569 6.97645 2.07844 8.30736C1.53118 9.63828 1.25203 11.0641 1.25699 12.5032C1.27655 18.5085 6.25956 23.3965 12.364 23.3965H21.9767C22.2814 23.3961 22.5736 23.2749 22.7891 23.0595C23.0045 22.844 23.1257 22.5518 23.1261 22.2471V12.6386C23.1261 6.53415 18.2381 1.55114 12.2327 1.53158H12.195H12.1909Z" fill="#354999"/><path d="M6.85593 9.08423H11.987V10.802H8.86003V12.2852H11.3571V14.003H8.86003V15.549H12.1504V17.2668H6.85593V9.08423Z" fill="#354999"/><path d="M14.0371 14.7181C14.0371 14.7181 14.9645 15.5658 15.9924 15.5658C16.4113 15.5658 16.8513 15.4052 16.8513 14.9136C16.8513 13.936 13.1629 13.9737 13.1629 11.4543C13.1629 9.94315 14.4352 8.94739 16.0608 8.94739C17.8247 8.94739 18.6948 9.87472 18.6948 9.87472L17.847 11.5115C17.847 11.5115 17.023 10.7909 16.0315 10.7909C15.6125 10.7909 15.16 10.9738 15.16 11.4319C15.16 12.4626 18.8484 12.2796 18.8484 14.8675C18.8484 16.2306 17.8065 17.4107 15.9616 17.4107C14.8558 17.425 13.7884 17.0053 12.9883 16.2417L14.0371 14.7181Z" fill="#354999"/></svg>`,
      slug: "es",
    },
    {
      name: "English",
      flag: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.9767 24.9015H12.364C5.56825 24.9015 0.0224126 19.4548 6.7276e-05 12.7512C-0.00526234 11.1468 0.306118 9.55719 0.916359 8.07338C1.5266 6.58957 2.4237 5.24079 3.55623 4.10436C4.68876 2.96794 6.03445 2.06622 7.51616 1.45089C8.99787 0.835562 10.5865 0.51873 12.1909 0.518555L12.2327 0.518555C18.9364 0.5409 24.383 6.08674 24.383 12.8825V22.4952C24.3823 23.1332 24.1285 23.7448 23.6774 24.1959C23.2263 24.647 22.6147 24.9008 21.9767 24.9015ZM12.1909 1.77548C10.7518 1.77547 9.32694 2.05953 7.99792 2.61136C6.6689 3.1632 5.46188 3.97195 4.44608 4.99125C3.43029 6.01055 2.62569 7.22035 2.07844 8.55126C1.53118 9.88217 1.25203 11.308 1.25699 12.747C1.27655 18.7524 6.25956 23.6404 12.364 23.6404H21.9767C22.2814 23.64 22.5736 23.5188 22.7891 23.3033C23.0045 23.0879 23.1257 22.7957 23.1261 22.491V12.8825C23.1261 6.77805 18.2381 1.79503 12.2327 1.77548H12.195H12.1909Z" fill="#354999"/><path d="M5.58644 8.56006H10.7231V10.2779H7.59613V11.7666H10.0932V13.4844H7.59613V15.0304H10.8837V16.7482H5.58644V8.56006Z" fill="#354999"/><path d="M12.3263 8.56006H14.3528L16.6194 12.3895C16.8726 12.8428 17.1019 13.3089 17.3066 13.7861H17.3289C17.3289 13.7861 17.2381 12.9034 17.2381 12.3895V8.56006H19.2422V16.7482H17.227L14.9435 12.9356C14.6904 12.4823 14.4611 12.0161 14.2564 11.539H14.2453C14.2453 11.539 14.3374 12.4216 14.3374 12.9356V16.7482H12.3263V8.56006Z" fill="#354999"/></svg>`,
      slug: "en",
    },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground
      source={require('../assets/splash.png')}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={logoWhite}
          style={{ width: 120, resizeMode: "contain", height: 120 }}
        />
        <FlatList
          horizontal
          contentContainerStyle={{
            flexDirection: "row",
            gap: 30,
            marginBottom: 15,
            alignItems: "center",
            justifyContent: "center",
          }}
          data={arrayAvailableLanguages}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setActualLanguage(item.slug)}
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1 },
                {
                  overflow: "hidden",
                  borderRadius: 100 / 2,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(217,217,217,.8)",
                  flexDirection: "row",
                  gap: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                },
              ]}
            >
              <IconSvg width={24} height={24} icon={item.flag} />

              <Text style={{ fontSize: 16, fontFamily: "MuseoSans_500" }}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(53,73,143,.8)",
  },
});

export default Page;
