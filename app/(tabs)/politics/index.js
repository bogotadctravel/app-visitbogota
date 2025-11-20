import { View, Text, Dimensions } from "react-native";
import React from "react";
import { fetchBogotaDrplV2 } from "../../../src/api/imperdibles";
import PreloaderComponent from "../../../src/components/PreloaderComponent";
import { ScrollView } from "react-native";
import { selectActualLanguage } from "../../../src/store/selectors";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import { windowWidth } from "../../../src/constants/ScreenWidth";

const politics = () => {
  const [politics, setPolitics] = React.useState(null);
  const actualLanguage = useSelector(selectActualLanguage);
  React.useEffect(() => {
    const getPolitics = async () => {
      const data = await fetchBogotaDrplV2("/gcontent/1", actualLanguage);

      setPolitics(data[0]);
    };
    getPolitics();
  }, [actualLanguage]);

  if (!politics) {
    return <PreloaderComponent />;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "#FFF",
        minHeight: Dimensions.get("window").height,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          marginBottom: 30,
          lineHeight: 25,
          textAlign: "center",
          fontFamily: "MuseoSans_500",
        }}
      >
        {politics.title}
      </Text>
      <RenderHTML
        contentWidth={windowWidth}
        source={{ html: politics.body }}
        tagsStyles={{
          p: {
            textAlign: "left",
            color: "#777",
            fontFamily: "MuseoSans_500",
            lineHeight: 30,
            fontSize: 16,
          },
          ul: { paddingLeft: 25, margin: 0 },
          li: {
            textAlign: "left",
            color: "#777",
            fontFamily: "MuseoSans_500",
            lineHeight: 22,
            fontSize: 16,
          },
        }}
      />
    </ScrollView>
  );
};

export default politics;
