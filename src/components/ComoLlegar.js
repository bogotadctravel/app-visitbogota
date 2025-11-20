import { View, Text, ImageBackground, Pressable } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectActualLanguage, selectWordsLang } from "../store/selectors";
import { windowWidth } from "../constants/ScreenWidth";
import WebView from "react-native-webview";

const ComoLlegar = ({ onPress, location }) => {
  return (
    <Pressable
      style={{ alignSelf: "center", marginBottom: 30, flex: 1, width: "90%" }}
      onPress={onPress}
    >
      <WebView
        scalesPageToFit={true}
        bounces={false}
        javaScriptEnabled
        style={{ height: 185, width: "100%" }}
        source={{
          html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                    </head>
                    <body>
                      <div id="baseDiv">
                       <iframe
                        width="100%"
                        height="500"
                        style="border:0"
                        loading="lazy"
                        allowfullscreen
                        referrerpolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q=${location}&z=18&output=embed">
                        </iframe>
                      </div>
                    </body>
                  </html>
            `,
        }}
        automaticallyAdjustContentInsets={false}
      />
    </Pressable>
  );
};

export default ComoLlegar;
