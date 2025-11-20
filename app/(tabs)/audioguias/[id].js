import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "../../../src/constants";
import { PreloaderComponent } from "../../../src/components";
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles";
import { useLocalSearchParams } from "expo-router";
import AudioPlayer from "../../../src/components/AudioPlayer";
import { selectActualLanguage } from "../../../src/store/selectors";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SingleAudio = () => {
  const { id } = useLocalSearchParams();
  const actualLanguage = useSelector(selectActualLanguage);
  const [audioguide, setAudioguide] = React.useState(null);

  React.useEffect(() => {
    const getSingleaudioguide = async () => {
      const data = await fetchBogotaDrplV2(
        `/aguides/${id}/all`,
        actualLanguage
      );
      setAudioguide(data[0]);
    };

    getSingleaudioguide();
  }, [id, actualLanguage]);

  if (!audioguide) {
    return <PreloaderComponent />;
  }
  const audioTitles = (audioguide.field_audiotitles || "")
    .split(",")
    .map((t) => t.trim());

  const audioPaths = (audioguide.field_audios || "")
    .split(",")
    .map((p) => p.trim());

  const audioArray = audioTitles.map((title, index) => ({
    title: title.split(" / ")[0],
    subtitle: title.split(" / ")[1],
    audio: `https://files.visitbogota.co${audioPaths[index]}`,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        blurRadius={3}
        style={{
          flex: 1,
        }}
        source={{
          uri: `https://files.visitbogota.co${
            audioguide.field_mainimg
              ? audioguide.field_mainimg
              : "/img/noimg.png"
          }`,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
            width: "100%",
            flex: 1,
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <Text style={styles.text}>{audioguide.title}</Text>
          <AudioPlayer
            audios={audioArray}
            image={`https://files.visitbogota.co${
              audioguide.field_mainimg
                ? audioguide.field_mainimg
                : "/img/noimg.png"
            }`}
          />
        </View>
      </ImageBackground>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontFamily: "MuseoSans_500",
    fontSize: 22,
    textShadowColor: "rgba(0, 0, 0, .7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginVertical: 15,
    textAlign: "center",
  },
});

export default SingleAudio;
