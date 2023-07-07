import React, { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import ContentCard from "../components/ContentCard";
import MovieService from "../services/MovieService";

const WatchlistScreen = ({ navigation }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);

  const [favoriteMovies, setFavoriteMovies] = useState([]);

  async function fetchFavorites() {
    const favoriteMovies = MovieService.getFavoriteMovies();
    console.log(favoriteMovies.length);
    setLoading(true);
    setFavoriteMovies(favoriteMovies);
    setLoading(false);
  }

  useEffect(() => {
    fetchFavorites();
  }, []);
  const windowHeight = Dimensions.get("window").height;

  if (favoriteMovies.length && !loading) {
    return (
      // <SafeAreaView contentContainerStyle={{ width: "100%" }}>
      <View style={{ flex: 1, paddingVertical: 40,paddingHorizontal: 6, flexGrow: windowHeight }}>
        <ScrollView
          contentContainerStyle={{
            flexWrap: "wrap",
            // flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            flexGrow: windowHeight,
            // paddingVertical: 30,
          }}
        >
          {favoriteMovies.map((item) => (
            <ContentCard
              onFavorites={fetchFavorites}
              width={180}
              height={270}
              navigation={navigation}
              item={item}
            />
          ))}
        </ScrollView>
      </View>
      // </SafeAreaView>
    );
  } else if (loading) {
    return <CentredActivityIndicator />;
  } else {
    return (
      <View style={{ flexGrow: windowHeight, flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/EmptyList.png")}
          style={{ width: 648 * 0.5, height: 632 * 0.5 }}
        />
        <Text
          style={{ ...styles.emptyListTextStyle, color: theme.colors.primary }}
        >
          Ваш список пуст
        </Text>
        <Text style={styles.descriptionTextStyle}>
          Похоже, вы не добавили никакого контента в избранные.
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  emptyListTextStyle: {
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
});

export default WatchlistScreen;
