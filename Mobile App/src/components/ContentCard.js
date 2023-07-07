import React, { useState } from "react";
import { ImageBackground, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MovieService from "../services/MovieService";

const ContentCard = ({
  item,
  navigation,
  width,
  height,
  onFavorites = () => {},
}) => {
  const theme = useTheme();

  const [isInFavorites, setIsInFavorites] = useState(
    MovieService.isInFavoriteMovies(item)
  );

  return (
    <Pressable
      style={{ width: width, margin: 5 }}
      onPress={() => navigation.navigate("Смотреть фильм", { item: item })}
    >
      <ImageBackground
        style={{ width: width, height: height }}
        imageStyle={{ borderRadius: 15 }}
        source={{ uri: item.info.poster }}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              setIsInFavorites((prev) => !prev);
              MovieService.toggleMovieFromFavorites(item);
              onFavorites();
            }}
          >
            <Icon
              name={isInFavorites ? "heart" : "cards-heart-outline"}
              size={40}
              color={"white"}
              style={{
                textShadowOffset: {
                  width: 1,
                  height: 1,
                },
                textShadowColor: "black",
                textShadowRadius: 1,
              }}
            />
          </Pressable>
          <Text style={styles.year}>{item.info.year}</Text>
        </View>

        {item.info.trailer ? <Text style={styles.trailer}>Трейлер</Text> : null}
        <View style={styles.ratingContainer}>
          <View style={[styles.rating, { marginBottom: 8 }]}>
            <Text style={styles.ratingKpText}>КР:</Text>
            <Text>{item.info.rating.rating_kp}</Text>
          </View>
          <View style={styles.rating}>
            <Text style={[styles.ratingKpText, styles.ratingImbdText]}>
              IMDb:
            </Text>
            <Text>{item.info.rating.rating_imdb}</Text>
          </View>
        </View>
      </ImageBackground>
      <Text numberOfLines={1} style={styles.titleStyle}>
        {item.info.rus}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  trailer: {
    marginTop: 6,
    marginRight: 6,
    textAlign: "right",
    fontWeight: 900,
    fontSize: 18,
    fontFamily: "Impact,Arial,sans-serif",
  },
  header: {
    marginTop: 4,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 6,
  },
  year: {
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowColor: "black",
    textShadowRadius: 1,
    marginRight: 6,
    textAlign: "right",
    fontWeight: 900,
    fontSize: 13,
    fontFamily: "Impact,Arial,sans-serif",
  },
  ratingContainer: {
    marginTop: "80%",
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  rating: {
    backgroundColor: "rgba(37,40,45,.8)",
    fontSize: 13,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 10,
    marginLeft: 4,
    textAlign: "right",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#343842",
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 5,
    width: 80,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  ratingKpText: {
    marginRight: 8,
    fontWeight: 900,
    fontSize: 13,
    color: "#e78128",
    fontFamily: "Impact,Arial,sans-serif",
  },
  ratingImbdText: {
    color: "#f5c518",
  },
  ratingTextStyle: {
    width: 40,
    margin: 3,
    padding: 5,
    textAlign: "center",
    fontSize: 12,
    borderRadius: 10,
    color: "black",
    fontWeight: "bold",
  },
  titleStyle: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 3,
  },
});

export default ContentCard;
