import { getPaletteSync } from "@assembless/react-native-material-you";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import ContentCard from "../components/ContentCard";
import { Storage } from "../components/Storage";
import ToggleButton from "../components/ToggleButton";
import { moviesContentTypes, moviesGenres } from "../data/movieData";
import appConfigService from "../services/AppConfigService";
import MovieService from "../services/MovieService";
import { arraysEqual } from "../utils/arrayEquals";
import { debounce } from "../utils/debounce";
import { filterByContentType } from "../utils/filterByContentType";
import { filterByGenres } from "../utils/filterByGenres";

const SearchScreen = ({ navigation }) => {
  const moviesPerPage = 20;

  const theme = useTheme();
  const palette = getPaletteSync();

  const bottomSheetRef = useRef(null);

  const [searchText, setSearchText] = useState(
    appConfigService.config ? appConfigService.config.actualSearchTheme : ""
  );

  const [page, setPage] = useState(0);
  const [appliedContentTypes, setAppliedContentTypes] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchText && !appConfigService.config) {
      (async function () {
        await appConfigService.fetchData();
        console.log(appConfigService.config);
        if (!searchText)
          setSearchText(appConfigService.config.actualSearchTheme);
      })();
    } else if (appConfigService.config.actualSearchTheme) {
      setSearchText(appConfigService.config.actualSearchTheme);
    }
  }, []);
  function restoreState() {
    if (Storage.contains("searchScreenState")) {
      const searchScreenState = JSON.parse(
        Storage.getString("searchScreenState")
      );

      if (
        searchScreenState.searchText.length &&
        searchScreenState.searchText != searchText
      )
        setSearchText(searchScreenState.searchText);
      if (
        searchScreenState.appliedContentTypes.length &&
        !arraysEqual(searchScreenState.appliedContentTypes, appliedContentTypes)
      )
        setAppliedContentTypes(searchScreenState.searchText);
      if (
        searchScreenState.selectedGenres.length &&
        !arraysEqual(searchScreenState.selectedGenres, selectedGenres)
      )
        setSelectedGenres(searchScreenState.selectedGenres);
      if (searchScreenState.data && !Object.is(searchScreenState.data, data))
        setSearchText(searchScreenState.data);
      if (Number.isInteger(searchScreenState.page) && searchScreenState != page)
        setPage(searchScreenState.page);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      const searchScreenState = {
        searchText,
        appliedContentTypes: appliedContentTypes,
        selectedGenres: selectedGenres,
        data: data,
        page: page,
      };

      Storage.set("searchScreenState", JSON.stringify(searchScreenState));
    });

    return unsubscribe;
  }, [navigation, searchText, appliedContentTypes, selectedGenres, data]);

  useEffect(() => {
    restoreState();
  }, []);

  const movies = useMemo(() => {
    if (data.length) {
      if (selectedGenres.length) {
        const filteredMovies = filterByGenres(data, selectedGenres);

        return appliedContentTypes.length == 2
          ? filteredMovies
          : filterByContentType(filteredMovies, appliedContentTypes);
      } else {
        if (appliedContentTypes.length) {
          return filterByContentType(data, appliedContentTypes);
        } else {
          return data;
        }
      }
    } else return [];
  }, [data, selectedGenres, appliedContentTypes]);

  const debouncedFetchData = debounce(async () => {
    if (searchText.length == 0) return;
    setPage(0);

    let fetchedData;

    if (searchText[0] === "#")
      fetchedData = [
        await MovieService.fetchFilmByKp(
          appConfigService.config.filmCodeKpIdPairs[searchText.slice(1)]
        ),
      ].filter(
            (item) => item
          );
    else fetchedData = await MovieService.fetchFilms(searchText);
    console.log(fetchedData);
    setData(fetchedData && fetchedData.length ? fetchedData : []);
    setLoading(false);
    // console.log(data);
  }, 300);

  useEffect(debouncedFetchData, [searchText]);

  function canPrev() {
    return page != 0;
  }

  function canNext() {
    const moviesWatched = (page + 1) * moviesPerPage;
    return moviesWatched < movies.length;
  }

  function goPrev() {
    if (!canPrev()) return;

    setPage((prev) => prev - 1);
  }

  function goNext() {
    if (!canNext()) return;

    setPage((prev) => prev + 1);
  }

  const pagedMovies = useMemo(
    () => movies.slice(moviesPerPage * page, moviesPerPage * (page + 1)),
    [movies, page]
  );
  const windowHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.searchBarParentStyle}>
          <TextInput
            placeholder="Поиск"
            mode="flat"
            style={{
              ...styles.searchBarStyle,
              backgroundColor: palette.system_accent1[4] + "3C",
            }}
            left={
              <TextInput.Icon
                icon="magnify"
                iconColor={palette.system_accent1[6]}
              />
            }
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            cursorColor="black"
            onChangeText={(text) => setSearchText(text)}
            placeholderTextColor={palette.system_accent1[4]}
          />
          <Icon
            name="sliders"
            size={27}
            color={theme.colors.primary}
            style={{
              ...styles.iconStyle,
              backgroundColor: theme.colors.elevation.level4,
            }}
            onPress={() => bottomSheetRef.current.open()}
          />
        </View>

        {pagedMovies.length === 0 ? (
          loading ? (
            <View style={{ height: windowHeight * 0.8 }}>
              <CentredActivityIndicator />
            </View>
          ) : (
            <View style={styles.imageParentStyle}>
              <Image
                source={require("../assets/NotFound.png")}
                style={{ width: 860 * 0.3, height: 571 * 0.3 }}
              />
              <Text
                style={{
                  ...styles.notFoundTextStyle,
                  color: theme.colors.primary,
                }}
              >
                Не найдено
              </Text>
              <Text style={styles.descriptionTextStyle}>
                К сожалению, введенные вами ключевые слова не найдены.
                Попробуйте проверить снова или выполните поиск по другим
                ключевым словам.
              </Text>
            </View>
          )
        ) : (
          <View>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                flexWrap: "wrap",
                flex: 1,
                justifyContent: "center",
              }}
            >
              {pagedMovies.map((item) => (
                <ContentCard
                  id={item["kinopoisk_id"]}
                  width={180}
                  height={270}
                  navigation={navigation}
                  item={item}
                />
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              <Pressable onPress={goPrev}>
                <Icon
                  name={"chevron-left"}
                  size={50}
                  color={canPrev() ? "white" : "gray"}
                />
              </Pressable>
              <Pressable onPress={goNext}>
                <Icon
                  name={"chevron-right"}
                  size={50}
                  color={canNext() ? "white" : "gray"}
                />
              </Pressable>
            </View>
          </View>
        )}

        <RBSheet
          ref={bottomSheetRef}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={Dimensions.get("window").height * 0.9}
          customStyles={{
            wrapper: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            draggableIcon: {
              backgroundColor: theme.colors.primary,
            },
            container: {
              borderRadius: 30,
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Text style={styles.filterTitleStyle}>Фильтр</Text>
          <View style={styles.separatorStyle} />
          <Text style={styles.filterSectionStyle}>Категории</Text>
          <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
            {moviesContentTypes.map((contentType) => (
              <ToggleButton
                title={contentType}
                filters={appliedContentTypes}
                setFilters={setAppliedContentTypes}
                value={contentType}
                key={contentType}
              />
            ))}
          </View>
          <Text style={styles.filterSectionStyle}>Жанры</Text>
          <ScrollView
            contentContainerStyle={{
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            {moviesGenres.map(({ label }) => (
              <ToggleButton
                title={label}
                filters={selectedGenres}
                setFilters={setSelectedGenres}
                value={label}
                key={label}
              />
            ))}
          </ScrollView>
        </RBSheet>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBarStyle: {
    margin: 20,
    marginRight: 10,
    borderRadius: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flex: 1,
  },
  iconStyle: {
    marginRight: 20,
    borderRadius: 15,
    padding: 15,
  },
  searchBarParentStyle: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  filterTitleStyle: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    padding: 15,
    letterSpacing: 1.15,
  },
  separatorStyle: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 3,
    flex: 1,
    width: Dimensions.get("window").width * 0.875,
    alignSelf: "center",
  },
  filterSectionStyle: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 15,
  },
  imageParentStyle: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  notFoundTextStyle: {
    fontWeight: "bold",
    fontSize: 26,
    margin: 20,
  },
  descriptionTextStyle: {
    textAlign: "center",
    marginHorizontal: 10,
    fontSize: 16,
    letterSpacing: 0.75,
  },
  pagination: {
    marginVertical: 20,
    marginHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default SearchScreen;
