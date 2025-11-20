import React, { useRef } from "react";
import {
  Pressable,
  StyleSheet,
  FlatList,
  Text,
  View,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, fetchPlacesWithFilters } from "../../src/store/actions";
import { CardAtractivo, PreloaderComponent } from "../../src/components";
import { router, useLocalSearchParams } from "expo-router";
import { fetchBogotaDrplV2 } from "../../src/api/imperdibles";
import { Colors } from "../../src/constants";
import { windowHeight } from "../../src/constants/ScreenWidth";
import {
  selectActualLanguage,
  selectWordsLang,
} from "../../src/store/selectors";
import CardAtractivoBig from "../../src/components/CardAtractivoBig";
import IconSvg from "../../src/components/IconSvg";

export default function TabTwoScreen() {
  const flatListRef = useRef(null);

  const wordsLanguage = useSelector(selectWordsLang);
  const actualLanguage = useSelector(selectActualLanguage);
  const params = useLocalSearchParams();
  const [filterID, setFilterID] = React.useState(null);
  const [queriesCompleted, setQueriesCompleted] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [categories, setCategories] = React.useState([]);
  const [atractivos, setAtractivos] = React.useState([]);
  const dispatch = useDispatch();
  const categoriesListRef = React.useRef(null); // Ref for categories FlatList

  React.useEffect(() => {
    setFilterID(params.filterID);
  }, [params.filterID, filterID]);

  React.useEffect(() => {
    const requestAtractivosInit = async (tid) => {
      const atractivos = await fetchBogotaDrplV2(
        `/atractivos/all/${tid}`,
        actualLanguage
      );
      const filterAtractivos = atractivos.map((atractivo) => ({
        title: atractivo.title,
        nid: atractivo.nid,
        field_cover_image: atractivo.field_cover_image,
      }));
      setAtractivos(filterAtractivos);
    };

    Promise.all([
      fetchBogotaDrplV2("/tax/categorias_atractivos_2024/all", actualLanguage),
    ])
      .then(([categorias_atractivos_2024]) => {
        dispatch(fetchData());
        setCategories(categorias_atractivos_2024);
        setQueriesCompleted(true);
      })
      .catch((error) => console.error(error));
  }, [filterID, dispatch, params.filterID, actualLanguage]);

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 20,
            gap: 8,
          }}
        >
          {/* IconSvg component omitted for brevity */}
          <IconSvg
            width="25"
            height="25"
            icon={`<svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.9965 9.53078C17.9498 9.872 17.9149 10.2132 17.8566 10.5515C17.5173 12.5819 16.4793 14.4297 14.9222 15.7748C13.6155 16.9507 11.9802 17.6978 10.2364 17.9154C8.9209 18.1119 7.57801 18.0068 6.30899 17.6082C5.03996 17.2096 3.87793 16.5279 2.9105 15.6144C1.47349 14.3213 0.505111 12.588 0.156735 10.6857C-0.270922 8.4216 0.184215 6.07959 1.4286 4.14098C2.67299 2.20237 4.61209 0.814451 6.84736 0.262476C7.32818 0.148736 7.82648 0.107907 8.30438 0.029164C8.3564 0.0225349 8.40797 0.0127962 8.45882 0L9.52536 0C9.7614 0.029164 10.0003 0.0524951 10.2364 0.0845755C12.1221 0.34849 13.8757 1.20407 15.2449 2.52829C16.6141 3.85252 17.5285 5.57718 17.8566 7.45431C17.9149 7.79261 17.9498 8.13383 17.9965 8.47505V9.53078ZM9.00666 0.583279C7.34347 0.581551 5.7171 1.07342 4.3332 1.99669C2.94931 2.91997 1.87002 4.23318 1.23181 5.77031C0.593606 7.30743 0.425135 8.99942 0.747702 10.6324C1.07027 12.2653 1.86939 13.7659 3.04402 14.9443C4.21865 16.1227 5.71605 16.9261 7.34688 17.2529C8.97771 17.5797 10.6687 17.4152 12.2062 16.7802C13.7436 16.1452 15.0584 15.0682 15.9842 13.6855C16.9101 12.3027 17.4055 10.6762 17.4078 9.01167C17.4105 7.9058 17.1952 6.81026 16.7742 5.7878C16.3532 4.76535 15.7348 3.83605 14.9544 3.05313C14.174 2.27021 13.247 1.64906 12.2264 1.22525C11.2058 0.801429 10.1116 0.583276 9.00666 0.583279Z" fill="#354999"/><path d="M16.752 9.00873C16.7508 10.5434 16.2951 12.0432 15.4423 13.3187C14.5896 14.5941 13.3781 15.5879 11.9611 16.1744C10.5441 16.7609 8.98516 16.9137 7.48137 16.6136C5.97758 16.3135 4.59645 15.5739 3.51258 14.4884C2.42871 13.4028 1.69077 12.02 1.39204 10.5148C1.09332 9.00953 1.24722 7.44944 1.83429 6.03173C2.42136 4.61402 3.41524 3.40233 4.6903 2.54985C5.96535 1.69737 7.46432 1.24237 8.99772 1.24237C11.0536 1.24777 13.0237 2.06792 14.4769 3.5234C15.9301 4.97887 16.7481 6.95116 16.752 9.00873ZM16.1488 8.71709C16.0769 6.91856 15.3309 5.21308 14.0591 3.94031C12.7874 2.66754 11.0833 1.92086 9.28621 1.84898V2.04146C9.28621 2.39143 9.28621 2.74431 9.28621 3.09428C9.28928 3.13336 9.28385 3.17264 9.27029 3.20942C9.25673 3.2462 9.23536 3.2796 9.20767 3.30732C9.17997 3.33503 9.1466 3.35642 9.10985 3.36999C9.0731 3.38356 9.03385 3.38899 8.99481 3.38592C8.91752 3.38592 8.8434 3.3552 8.78875 3.3005C8.7341 3.24581 8.7034 3.17163 8.7034 3.09428C8.7034 3.01846 8.7034 2.93971 8.7034 2.86389V1.8519C4.95012 1.94522 1.90496 5.17659 1.85542 8.71418H2.03609C2.38286 8.71418 2.72963 8.71418 3.07349 8.71418C3.15077 8.71418 3.22489 8.7449 3.27954 8.7996C3.33419 8.85429 3.36489 8.92847 3.36489 9.00582C3.36489 9.08317 3.33419 9.15735 3.27954 9.21204C3.22489 9.26673 3.15077 9.29746 3.07349 9.29746C2.80539 9.29746 2.53439 9.29746 2.2663 9.29746H1.84668C1.92064 11.0945 2.66766 12.7978 3.93918 14.0687C5.21071 15.3396 6.9136 16.0851 8.70923 16.1568V15.9673C8.70923 15.6173 8.70923 15.2644 8.70923 14.9144C8.70666 14.8755 8.71243 14.8364 8.72616 14.7999C8.73989 14.7633 8.76127 14.7301 8.78886 14.7025C8.81645 14.6749 8.84962 14.6535 8.88614 14.6397C8.92267 14.626 8.9617 14.6202 9.00063 14.6228C9.07792 14.6228 9.15204 14.6535 9.20669 14.7082C9.26134 14.7629 9.29204 14.8371 9.29204 14.9144C9.29204 14.9903 9.29204 15.069 9.29204 15.1448V16.1597C13.0803 16.0664 16.0963 12.8321 16.1459 9.29746H15.939C15.5922 9.29746 15.2483 9.29746 14.9016 9.29746C14.8362 9.30022 14.7721 9.27841 14.722 9.23632C14.6718 9.19423 14.6392 9.1349 14.6306 9.06998C14.6183 9.01133 14.6267 8.95025 14.6543 8.89709C14.6819 8.84394 14.7271 8.80198 14.7821 8.77834C14.8524 8.75028 14.928 8.73832 15.0035 8.74334L16.1488 8.71709Z" fill="#354999"/><path d="M13.3251 5.00454C13.3081 5.0602 13.2877 5.11475 13.2639 5.16785C12.4625 6.97602 11.6641 8.78419 10.854 10.5865C10.796 10.7054 10.6994 10.801 10.58 10.8577C8.77918 11.6685 6.97539 12.4734 5.16869 13.2725C5.02007 13.3396 4.87728 13.3775 4.74906 13.2434C4.62085 13.1092 4.65873 12.978 4.72867 12.8321C5.531 11.0337 6.33139 9.23331 7.12983 7.43098C7.18507 7.29934 7.2897 7.19463 7.42123 7.13934L12.818 4.74206C12.8861 4.70879 12.9588 4.68617 13.0337 4.67498C13.0753 4.67463 13.1166 4.68323 13.1547 4.70019C13.1928 4.71716 13.2267 4.7421 13.2544 4.77334C13.282 4.80457 13.3026 4.84137 13.3148 4.88126C13.327 4.92114 13.3305 4.96318 13.3251 5.00454ZM12.4509 5.5324L7.93119 7.54472C8.06232 7.67596 8.17597 7.79261 8.29836 7.90052C8.31943 7.91002 8.34227 7.91493 8.36538 7.91493C8.38849 7.91493 8.41134 7.91002 8.43241 7.90052C8.66186 7.78491 8.92184 7.7445 9.17552 7.78499C9.4292 7.82549 9.66372 7.94485 9.84585 8.12616C10.028 8.30747 10.1485 8.54154 10.1903 8.79521C10.2321 9.04888 10.1931 9.30928 10.0788 9.53953C10.0614 9.57745 10.0497 9.64161 10.0788 9.66202C10.1925 9.79034 10.3178 9.90991 10.4518 10.0441L12.4509 5.5324ZM7.54362 7.93843L5.53294 12.4734L10.0847 10.4494C9.94479 10.327 9.83406 10.222 9.71167 10.1316C9.68619 10.1147 9.65734 10.1036 9.62714 10.0991C9.59694 10.0946 9.56612 10.0967 9.53683 10.1053C9.30684 10.2167 9.04785 10.2534 8.79602 10.2103C8.54419 10.1672 8.31207 10.0466 8.13206 9.86512C7.95205 9.68368 7.83313 9.45052 7.7919 9.19819C7.75066 8.94585 7.78917 8.68693 7.90205 8.45755C7.91055 8.43318 7.91364 8.40726 7.91113 8.38158C7.90861 8.35589 7.90054 8.33106 7.88748 8.30881C7.7884 8.18924 7.67476 8.07842 7.54362 7.93843ZM9.00064 8.36714C8.8749 8.36484 8.75131 8.39995 8.64553 8.46801C8.53974 8.53607 8.45652 8.63402 8.4064 8.74946C8.35629 8.8649 8.34154 8.99262 8.36402 9.11646C8.3865 9.24029 8.4452 9.35466 8.53268 9.44508C8.62016 9.5355 8.73249 9.59789 8.85544 9.62436C8.97839 9.65083 9.10642 9.64019 9.22331 9.59377C9.34021 9.54736 9.44071 9.46727 9.51208 9.36364C9.58346 9.26001 9.62249 9.13751 9.62425 9.01166C9.62618 8.92893 9.61181 8.84663 9.58195 8.76946C9.5521 8.69229 9.50734 8.62176 9.45024 8.56191C9.39314 8.50206 9.32482 8.45405 9.24918 8.42063C9.17353 8.38721 9.09205 8.36903 9.00938 8.36714H9.00064Z" fill="#354999"/></svg>`}
          />
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              color: Colors.orange,
              fontFamily: "MuseoSans_500",
            }}
          >
            {wordsLanguage[actualLanguage][1]}
          </Text>
        </View>
        <FlatList
          fadingEdgeLength={15}
          ItemSeparatorComponent={() => (
            <View style={{ paddingHorizontal: 5 }} />
          )}
          horizontal
          data={categories}
          keyExtractor={(item) => item.tid}
          renderItem={({ item }) => {
            if (item.field_categor == "1") {
              return (
                <CardAtractivoBig
                  onPress={() => {
                    router.push({
                      pathname: "atractivos",
                      params: { filterID: item.tid },
                    });
                  }}
                  title={item.name}
                  image={
                    item.field_banner_prod != ""
                      ? `https://files.visitbogota.co${item.field_banner_prod}`
                      : "https://files.visitbogota.co/img/noimg.png"
                  }
                />
              );
            }
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "MuseoSans_500",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  filterButton: {
    paddingVertical: 10,
  },
});
