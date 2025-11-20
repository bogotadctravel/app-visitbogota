import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  Text,
} from "react-native";
import { Video } from "expo-video";
import { windowWidth } from "../constants/ScreenWidth";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const VideoPlayer = ({ videoSource, isVisible, onClose }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pauseAsync?.(); // Añade protección por si no está disponible
      }
    };
  }, []);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <Pressable
        onPress={onClose}
        style={{ position: "absolute", top: 15, right: 15, zIndex: 10 }}
      >
        <Ionicons name="close" size={35} color="#FFF" />
      </Pressable>
      <TouchableWithoutFeedback onPress={handlePlayPause}>
        <View style={styles.container}>
          <Video
            ref={videoRef}
            source={{ uri: videoSource }}
            style={styles.video}
            shouldPlay={isPlaying}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: windowWidth,
    height: (windowWidth * 9) / 16,
  },
});

export default VideoPlayer;
