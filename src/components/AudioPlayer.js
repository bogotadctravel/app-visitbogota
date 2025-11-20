import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { FontAwesome } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { formattedTime } from "../api/imperdibles";
import { useAudioPlayer } from "expo-audio";

const AudioPlayer = ({ image, audios }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const player = useAudioPlayer({ uri: audios[activeIndex]?.audio });
  // Estados del player
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setActiveIndex(0);
  }, []); // solo cuando se monta el componente

  // Sincronizar UI con el estado del player
  useEffect(() => {
    player?.play();
    const interval = setInterval(() => {
      setIsPlaying(player?.playing);
      setDuration(player?.duration);
      setPosition(player?.currentTime);
    }, 500);
    return () => clearInterval(interval);
  }, [player]);

  // Play/Pause
  const onPlayPausePress = () => {
    if (isPlaying) {
      player?.pause();
    } else {
      player?.play();
    }
  };

  // Avanzar automáticamente a la siguiente canción
  useEffect(() => {
    if (
      duration > 0 &&
      position >= duration &&
      activeIndex < audios.length - 1
    ) {
      playAudio(audios[activeIndex + 1].audio, activeIndex + 1);
    }
  }, [position]);

  // Seek
  const handleSliderSlidingComplete = async (value) => {
    await player?.seek(value);
  };

  // Cambiar de pista
  const playAudio = async (uri, index) => {
    setIsLoading(true);
    setActiveIndex(index);

    if (player?.isLoaded) {
      setIsLoading(false);
      await player?.play();
    }
  };

  return (
    <View style={{ padding: 20, width: "100%" }}>
      <Image
        source={{ uri: image }}
        style={{
          width: 180,
          height: 180,
          marginBottom: 30,
          borderRadius: 25,
          alignSelf: "center",
        }}
      />

      <Slider
        style={{ marginVertical: 10 }}
        minimumValue={0}
        maximumValue={player?.duration} // ya está en segundos
        value={player?.currentTime} // también en segundos
        step={1} // avanza de segundo en segundo
        thumbTintColor="#F8C823"
        onSlidingComplete={handleSliderSlidingComplete}
        minimumTrackTintColor="#F8C823"
        maximumTrackTintColor="#F8C823"
      />

      {/* Controls */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          marginBottom: 30,
        }}
      >
        <TouchableOpacity onPress={() => player?.seek(position - 10000)}>
          <FontAwesome name="fast-backward" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPlayPausePress} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <FontAwesome
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#FFF"
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => player?.seek(position + 10000)}>
          <FontAwesome name="fast-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Time */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#FFF" }}>
          {formattedTime(player?.currentTime)}
        </Text>
        <Text style={{ color: "#FFF" }}>{formattedTime(player?.duration)}</Text>
      </View>

      {/* Playlist */}
      {audios.length > 1 && (
        <FlatList
          data={audios}
          style={{ height: 250 }}
          contentContainerStyle={{ paddingVertical: 25 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              style={{
                padding: 20,
                backgroundColor:
                  activeIndex === index ? "#F8C823" : "rgba(255,255,255,.5)",
                marginBottom: 15,
                borderRadius: 25,
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => playAudio(item.audio, index)}
            >
              <Text style={{ color: "#000" }}>{item.title}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
};

export default AudioPlayer;
