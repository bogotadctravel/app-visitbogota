import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectActualLanguage, selectWordsLang } from "../store/selectors";

const ReadMoreText = ({ text, maxLines = 3 }) => {
  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const [showAll, setShowAll] = React.useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const renderText = () => {
    const lines = text.split("\n");
    if (showAll) {
      return lines.map((line, index) => <Text key={index}>{line}</Text>);
    } else {
      const truncatedText = lines.slice(0, maxLines).join("\n");
      return <Text>{truncatedText}</Text>;
    }
  };

  return (
    <>
      {renderText()}
      <TouchableOpacity
        onPress={toggleShowAll}
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingVertical: 20,
        }}
      >
        <Text
          style={{
            color: "#354999",
            fontFamily: "MuseoSans_500",
            fontSize: 16,
          }}
        >
          {showAll
            ? wordsLanguage[actualLanguage][19]
            : wordsLanguage[actualLanguage][18]}
        </Text>
      </TouchableOpacity>
    </>
  );
};
export default ReadMoreText;
