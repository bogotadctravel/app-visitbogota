import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles";
import { windowHeight, windowWidth } from "../../../src/constants/ScreenWidth";
import { Colors } from "../../../src/constants";
import { PreloaderComponent } from "../../../src/components";
import { selectActualLanguage } from "../../../src/store/selectors";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";
const transformIframesToWebViews = (htmlContent) => {
  const iframeRegex = /<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/g;
  let match;
  const parts = [];
  let lastIndex = 0;

  while ((match = iframeRegex.exec(htmlContent)) !== null) {
    const [iframeTag, src] = match;
    const index = match.index;

    parts.push(htmlContent.substring(lastIndex, index));
    parts.push(`<div class="webview" data-src="${src}"></div>`);

    lastIndex = index + iframeTag.length;
  }

  parts.push(htmlContent.substring(lastIndex));

  return parts.join("");
};

const renderers = {
  div: ({ TDefaultRenderer, tnode }) => {
    const { attributes } = tnode;
    if (attributes.class === "webview" && attributes["data-src"]) {
      const src = attributes["data-src"];
      return (
        <View
          style={{ width: windowWidth - 40, height: 200, marginBottom: 10 }}
        >
          <WebView
            originWhitelist={["*"]}
            source={{
              html: `<iframe allowfullscreen="allowfullscreen" height="500" src="${src}" width="100%"></iframe>`,
            }}
          />
        </View>
      );
    }
    return <TDefaultRenderer tnode={tnode} />;
  },
};

const SingleBlog = () => {
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = React.useState(null);
  const actualLanguage = useSelector(selectActualLanguage);
  const getSingleBlog = async () => {
    const data = await fetchBogotaDrplV2(`/blog/${id}/all`, actualLanguage);
    setBlog(data[0]);
  };

  React.useEffect(() => {
    getSingleBlog();
  }, [id, actualLanguage]);

  if (!blog) {
    return <PreloaderComponent />;
  }

  // --- SOLUCIÓN PARA LAS URLs DE LAS IMÁGENES ---
  const adjustImageUrls = (htmlContent) => {
    // Busca exactamente "/sites/default/files/" y lo reemplaza por la ruta completa en la API
    let html = htmlContent.replace(
      /\/sites\/default\/files\//g,
      "https://files.visitbogota.co/sites/default/files/"
    );

    return html;

  };
  const transformedHtml = transformIframesToWebViews(blog.body);
  function decodeSpecialChars(str) {
    return str
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&cent;/g, "¢")
      .replace(/&pound;/g, "£")
      .replace(/&yen;/g, "¥")
      .replace(/&euro;/g, "€")
      .replace(/&copy;/g, "©")
      .replace(/&reg;/g, "®")
      .replace(/&trade;/g, "™");
  }

  const source = {
    html: adjustImageUrls(transformedHtml),
  };

  const tagsStyles = {
    p: {
      textAlign: "left",
      color: "#777",
      fontFamily: "MuseoSans_500",
      lineHeight: 22,
      fontSize: 16,
      marginVertical: 5,
    },
    ul: { paddingLeft: 10, margin: 0 },
    li: {
      textAlign: "left",
      color: "#777",
      fontFamily: "MuseoSans_500",
      lineHeight: 22,
      fontSize: 16,
      marginBottom: 15,
    },

  };

  const availableWidth = windowWidth - 40;

  const renderersProps = {
    img: {
      enableExperimentalPercentWidth: true,
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
          uri: `https://files.visitbogota.co${blog.field_cover_image ? blog.field_cover_image : "/img/noimg.png"
            }`,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,.5)",
            flex: 1,
            padding: 20,
            justifyContent: "flex-end",
          }}
        >
          <Text style={styles.text}>{decodeSpecialChars(blog.title)}</Text>
        </View>
      </ImageBackground>
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <Text
          style={[
            {
              color: "#354999",
              fontFamily: "MuseoSans_500",
              lineHeight: 22,
              fontSize: 16,
            },
          ]}
        >
          {blog.field_intro_blog}
        </Text>
      </View>
      <RenderHTML
        baseStyle={{ paddingHorizontal: 20 }}
        renderersProps={renderersProps}
        source={source}
        tagsStyles={tagsStyles}
        renderers={renderers}
        contentWidth={availableWidth}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontFamily: "MuseoSans_500",
    fontSize: 20,
    textShadowColor: "rgba(0, 0, 0, .7)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
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

export default SingleBlog;
