import React from "react";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { windowHeight, windowWidth } from "../constants/ScreenWidth";
import { Colors } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import IconSvg from "./IconSvg";
import { selectActualLanguage } from "../store/selectors";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
const setMidnight = (dateString) => {
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date;
};

const DateComponent = ({ evento }) => {
  const actualLanguage = useSelector(selectActualLanguage);
  const dateStart = setMidnight(evento.field_date);

  let dateEnd;
  if (evento.field_end_date.length === 10) {
    dateEnd = setMidnight(evento.field_end_date);
    dateEnd.setDate(dateEnd.getDate() + 1);
  } else {
    dateEnd = setMidnight(evento.field_end_date);
  }

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const dateFormattedStart = dateStart.toLocaleDateString(
    actualLanguage == "es" ? "es-ES" : "en-US",
    options
  );
  const dateFormattedEnd = dateEnd.toLocaleDateString(
    actualLanguage == "es" ? "es-ES" : "en-US",
    options
  );
  const alText = actualLanguage === "es" ? "al" : "to";
  const hastaElText = actualLanguage === "es" ? "Hasta el" : "Until";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dateText = "";

  if (!evento.field_end_date) {
    dateText = dateFormattedStart;
  } else if (dateStart.getTime() === dateEnd.getTime()) {
    dateText = dateFormattedEnd;
  } else if (dateStart < today) {
    dateText = `${hastaElText} ${dateFormattedEnd}`;
  } else {
    dateText = `${dateFormattedStart} ${alText} ${dateFormattedEnd}`;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 15,
      }}
    >
      <IconSvg
        width="8"
        height="12"
        icon={`<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.21772 7.203C8.15317 6.40456 8.15317 4.95898 7.21772 4.16054L3.29841 0.8153C2.00024 -0.292727 0 0.629781 0 2.33652L0 9.02701C0 10.7338 2.00024 11.6563 3.29841 10.5482L7.21772 7.203Z" fill="#354999"/>
</svg>
`}
      />
      <Text
        style={{
          color: Colors.gray,
          fontFamily: "MuseoSans_500",
          fontSize: 18,
        }}
      >
        {dateText}
      </Text>
    </View>
  );
};

const CardEventoBig = ({
  image,
  title,
  onPress,
  start,
  end,
  place,
  isHorizontal,
  isRuta,
  desc,
}) => {
  const { width } = useWindowDimensions();
  const source = {
    html: desc,
  };

  const tagsStyles = {
    p: {
      color: Colors.white,
      fontFamily: "MuseoSans_500",
      fontSize: 14,
      lineHeight: 20,
      margin:0
    },
  };

  const [imagesLoaded, setImagesLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImagesLoaded(true);
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          justifyContent: "flex-end",
          opacity: pressed ? 0.5 : 1,
          width: windowWidth - 100,
          overflow: "hidden",
          height:
            Platform.OS === "ios" ? windowHeight - 430 : windowHeight - 320,
        },
      ]}
    >
      <ImageBackground
        style={[
          {
            justifyContent: "flex-end",
            width: windowWidth - 100,
            overflow: "hidden",
            height:
              Platform.OS === "ios" ? windowHeight - 400 : windowHeight - 320,
          },
        ]}
        source={{ uri: image }}
        onLoad={handleImageLoad}
      >
         <LinearGradient
          colors={["transparent", "rgba(0,0,0,.7)"]}
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >

        <View
          style={[
            {
              paddingHorizontal: 10,
              paddingVertical: 20,
              gap: 5,
            },
          ]}
        >
          <Text
            style={{
              color: Colors.white,
              fontFamily: "MuseoSans_500",
              fontSize: 20,
              lineHeight: 20,
            }}
          >
            {title}
          </Text>
         
          {/* {desc && (
            <RenderHTML
              contentWidth={width}
              source={source}
              tagsStyles={tagsStyles}
            />
          )} */}
        </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default CardEventoBig;
