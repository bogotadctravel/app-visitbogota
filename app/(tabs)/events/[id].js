import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles";
import { windowHeight, windowWidth } from "../../../src/constants/ScreenWidth";
import { Colors } from "../../../src/constants";
import { ComoLlegar, PreloaderComponent } from "../../../src/components";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import {
  selectActualLanguage,
  selectWordsLang,
} from "../../../src/store/selectors";
import RenderHTML from "react-native-render-html";
import IconSvg from "../../../src/components/IconSvg";
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
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <IconSvg
        width="20"
        height="20"
        icon={`<svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.77778 12H1.22222C0.547207 12 0 11.4627 0 10.8V2.4C0 1.73726 0.547207 1.2 1.22222 1.2H2.44444V0H3.66667V1.2H7.33333V0H8.55556V1.2H9.77778C10.4528 1.2 11 1.73726 11 2.4V10.8C11 11.4627 10.4528 12 9.77778 12ZM1.22222 4.8V10.8H9.77778V4.8H1.22222ZM1.22222 2.4V3.6H9.77778V2.4H1.22222ZM8.55556 9.6H7.33333V8.4H8.55556V9.6ZM6.11111 9.6H4.88889V8.4H6.11111V9.6ZM3.66667 9.6H2.44444V8.4H3.66667V9.6ZM8.55556 7.2H7.33333V6H8.55556V7.2ZM6.11111 7.2H4.88889V6H6.11111V7.2ZM3.66667 7.2H2.44444V6H3.66667V7.2Z" fill="#354999"/></svg>`}
      />
      <Text
        style={{
          color: "#777",
          fontFamily: "MuseoSans_500",
          fontSize: 16,
          lineHeight: 20,
        }}
      >
        {dateText}
      </Text>
    </View>
  );
};

const SingleEvent = () => {
  const { id } = useLocalSearchParams();
  const [events, setEvents] = React.useState(null);
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);

  React.useEffect(() => {
    const getSingleEvents = async () => {
      const data = await fetchBogotaDrplV2(
        `/eventsweb/${id}/all/all/all`,
        actualLanguage
      );
      setEvents(data[0]);
    };
    getSingleEvents();
  }, []);

  if (!events) {
    return <PreloaderComponent />;
  }
  const source = {
    html: events.body,
  };

  const tagsStyles = {
    p: {
      color: "#777",
      fontFamily: "MuseoSans_500",
      fontSize: 16,
      lineHeight: 20,
    },
  };

  return (
    <ScrollView>
      <ImageBackground
        style={{
          width: windowWidth,
          height: windowWidth - 120,
        }}
        source={{
          uri: `https://files.visitbogota.co${
            events.field_cover_image
              ? events.field_cover_image
              : "/img/noimg.png"
          }`,
        }}
      ></ImageBackground>
      <View
        style={{
          alignSelf: "center",
          marginTop: -60,
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,1)",
          padding: 20,
          justifyContent: "flex-end",
          width: windowWidth - 40,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Text style={[styles.text, { fontSize: 20, color: Colors.orange }]}>
          {events.title}
        </Text>
        <DateComponent evento={events} />
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
          }}
        >
          <IconSvg
            width="20"
            height="20"
            icon={`<svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.34059 12.6209C4.23787 12.5367 4.14342 12.4429 4.05853 12.3407C3.31309 11.278 2.56317 10.2175 1.83787 9.13913C1.22559 8.25746 0.727626 7.30146 0.355937 6.29409C0.11968 5.66482 -0.000907949 4.99793 5.14685e-06 4.32565C0.0288826 3.25607 0.441946 2.2328 1.16339 1.44363C1.88483 0.654469 2.86624 0.152355 3.92752 0.0294413C4.9888 -0.0934719 6.05874 0.171062 6.94098 0.774494C7.82322 1.37793 8.45856 2.27977 8.73042 3.31452C8.95188 4.22793 8.90287 5.18617 8.58939 6.07213C8.26335 7.0521 7.80384 7.98232 7.22386 8.83647C6.56349 9.83862 5.86729 10.8161 5.18677 11.8048C5.06365 11.9842 4.94724 12.1703 4.81293 12.3429C4.72511 12.4417 4.63089 12.5345 4.53087 12.6209H4.34059ZM4.43461 11.5851C4.44989 11.5697 4.4641 11.5532 4.47714 11.5358C5.1599 10.5516 5.85386 9.57856 6.51648 8.58313C7.09047 7.75232 7.54909 6.84726 7.87977 5.89278C8.14369 5.17597 8.20413 4.39994 8.05437 3.65082C7.85498 2.70519 7.29463 1.87498 6.49278 1.33722C5.69094 0.799455 4.71106 0.596688 3.76208 0.77215C2.81309 0.947613 1.97009 1.48742 1.41283 2.27648C0.855568 3.06553 0.628135 4.0414 0.779027 4.99599C0.89671 5.66711 1.11164 6.31742 1.41702 6.92632C1.92597 7.94082 2.51824 8.91119 3.18773 9.82741C3.59962 10.4081 4.01376 10.9887 4.43461 11.5851Z" fill="#354999"/><path d="M4.45027 2.19807C4.88862 2.20206 5.31597 2.33604 5.67837 2.58308C6.04076 2.83012 6.32195 3.17916 6.48643 3.58612C6.65092 3.99308 6.69132 4.43973 6.60255 4.86967C6.51378 5.29962 6.29981 5.69358 5.98766 6.00183C5.6755 6.31009 5.27915 6.5188 4.84865 6.60164C4.41815 6.68448 3.97279 6.63771 3.5688 6.46726C3.16481 6.2968 2.82031 6.0103 2.57877 5.64391C2.33724 5.27752 2.2095 4.84768 2.2117 4.40864C2.21345 4.1162 2.27278 3.82697 2.38629 3.55752C2.4998 3.28807 2.66525 3.04368 2.87318 2.83835C3.08111 2.63302 3.32744 2.47078 3.59805 2.36091C3.86867 2.25104 4.15827 2.19571 4.45027 2.19807ZM4.43907 2.93792C4.14651 2.93792 3.86052 3.02478 3.61723 3.18751C3.37395 3.35025 3.18429 3.58157 3.07223 3.85222C2.96017 4.12288 2.93074 4.42073 2.98765 4.70814C3.04456 4.99555 3.18527 5.25961 3.39198 5.46695C3.5987 5.67429 3.86214 5.81561 4.14903 5.87304C4.43591 5.93047 4.73336 5.90145 5.00378 5.78963C5.27419 5.6778 5.50545 5.48821 5.66831 5.2448C5.83117 5.00139 5.91832 4.7151 5.91877 4.4221C5.91818 4.02904 5.76216 3.65221 5.48486 3.37407C5.20755 3.09592 4.83154 2.9391 4.43907 2.93792Z" fill="#354999"/></svg>`}
          />
          <Text
            style={{
              color: "#777",
              fontFamily: "MuseoSans_500",
              fontSize: 16,
              lineHeight: 20,
            }}
          >
            {events.field_place}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <RenderHTML
          contentWidth={windowWidth}
          source={source}
          tagsStyles={tagsStyles}
        />
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <IconSvg
            width="11"
            height="18"
            icon={`<svg width="13" height="19" viewBox="0 0 13 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.3639 19C6.21331 18.8732 6.07483 18.732 5.95036 18.5781C4.85744 16.9783 3.75796 15.3819 2.69457 13.7584C1.79688 12.4311 1.0668 10.9919 0.521854 9.47537C0.175467 8.52805 -0.00133118 7.52408 7.54599e-06 6.512C0.0423459 4.90181 0.647953 3.36134 1.70568 2.1733C2.76342 0.985264 4.20231 0.229361 5.75829 0.0443221C7.31427 -0.140716 8.88295 0.257524 10.1764 1.16595C11.4699 2.07438 12.4014 3.43206 12.8 4.98981C13.1247 6.36489 13.0528 7.80746 12.5932 9.14123C12.1152 10.6165 11.4415 12.0169 10.5912 13.3028C9.62298 14.8115 8.60226 16.283 7.60452 17.7715C7.42401 18.0415 7.25334 18.3216 7.05642 18.5815C6.92766 18.7302 6.78952 18.87 6.64288 19H6.3639ZM6.50175 17.4407C6.52416 17.4174 6.54499 17.3926 6.56411 17.3664C7.56513 15.8848 8.58257 14.4199 9.55406 12.9214C10.3956 11.6706 11.068 10.3081 11.5528 8.87122C11.9398 7.79211 12.0284 6.62384 11.8088 5.49608C11.5165 4.0725 10.6949 2.82267 9.51932 2.0131C8.34371 1.20353 6.90707 0.898278 5.51572 1.16243C4.12438 1.42657 2.88843 2.23922 2.0714 3.4271C1.25438 4.61497 0.920933 6.08408 1.14216 7.52116C1.3147 8.5315 1.62982 9.5105 2.07755 10.4272C2.82374 11.9544 3.69209 13.4153 4.67365 14.7946C5.27754 15.6687 5.88472 16.5429 6.50175 17.4407Z" fill="#354999"/>
<path d="M6.53183 3.00011C7.22342 3.0064 7.89765 3.21746 8.4694 3.60663C9.04115 3.99579 9.48478 4.54563 9.74428 5.18673C10.0038 5.82783 10.0675 6.53144 9.92749 7.20874C9.78743 7.88604 9.44985 8.50666 8.95737 8.99225C8.46488 9.47785 7.83956 9.80665 7.16036 9.93714C6.48115 10.0676 5.77852 9.99397 5.14114 9.72545C4.50377 9.45692 3.96024 9.00559 3.57918 8.42841C3.19811 7.85123 2.99658 7.17409 3.00004 6.48247C3.00282 6.02178 3.09642 5.56615 3.2755 5.14168C3.45458 4.71721 3.71561 4.33222 4.04367 4.00876C4.37172 3.6853 4.76034 3.42972 5.1873 3.25664C5.61425 3.08356 6.07114 2.99639 6.53183 3.00011ZM6.51417 4.16561C6.0526 4.16561 5.60138 4.30244 5.21755 4.5588C4.83372 4.81517 4.5345 5.17956 4.3577 5.60593C4.18091 6.03231 4.13447 6.50152 4.22426 6.95427C4.31405 7.40703 4.53604 7.82301 4.86218 8.14964C5.18831 8.47626 5.60395 8.69888 6.05657 8.78936C6.50919 8.87984 6.97847 8.83411 7.4051 8.65796C7.83174 8.4818 8.19658 8.18313 8.45353 7.79969C8.71047 7.41624 8.84798 6.96523 8.84868 6.50366C8.84775 5.88447 8.6016 5.29085 8.1641 4.85268C7.7266 4.41452 7.13336 4.16748 6.51417 4.16561Z" fill="#354999"/>
</svg>
`}
          />
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              textAlign: "justify",
              fontSize: 22,
              color: Colors.orange,
              fontFamily: "MuseoSans_500",
            }}
          >
            {wordsLanguage[actualLanguage][73]}
          </Text>
        </View>
        <ComoLlegar
          location={events.field_location.trim()}
          onPress={() =>
            WebBrowser.openBrowserAsync(
              events.field_mapslink
                ? events.field_mapslink
                : `http://maps.google.com/maps?q=${events.field_location.trim()}`
            )
          }
        />
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontFamily: "MuseoSans_500",
    fontSize: 18,
    marginBottom: 15,
  },
  container: {
    flexDirection: "row", // Para que los Text se muestren en línea
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  firstLetter: {
    fontFamily: "MuseoSans_500",
    fontSize: 33, // Establece el tamaño de la primera letra
    color: "#777777", // Establece el color de la primera letra
    // Agrega otros estilos según tus preferencias
  },
});

export default SingleEvent;
