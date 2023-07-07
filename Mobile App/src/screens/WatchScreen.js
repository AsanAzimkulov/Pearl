import { useFocusEffect, useTheme } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ImageBackground,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import WebView from "react-native-webview";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import MovieService from "../services/MovieService";
import { formatList } from "../utils/formatList";
import { formatTimeToMinutes } from "../utils/formatTimeToMinutes";

const WatchScreen = ({ route, navigation }) => {
  const { item } = route.params;

  const theme = useTheme();


  function renderProperty(jsx, property) {
    return item.info[property] ? jsx : null;
  }
  const webViewScript = `
  setTimeout(function() { 
    window.ReactNativeWebView.postMessage(document.body.scrollHeight)
  }, 500);
  true; // note: this is required, or you'll sometimes get silent failures
`;

  const [webViewHeight, setWebViewHeight] = useState(300);
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      InteractionManager.runAfterInteractions(() => setIsFocused(true));
    }, [])
  );

  useEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", () => {
        setIsFocused(false);
      });
      return unsubscribe;
    }, [])
  );

  return (
    <View>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            navigation.navigate("Tab", {
              screen: "explore",
            })
          }
        >
          <Icon name={"chevron-left"} size={36} color={"white"} />
        </Pressable>
        <Text style={styles.title}>Смотреть фильм</Text>
      </View>
      <ScrollView>
        <View style={styles.body}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <ImageBackground
              style={{ width: 300, height: 450, marginBottom: 50 }}
              imageStyle={{
                borderRadius: 15,
              }}
              source={{ uri: item.info.poster }}
            >
              <Text style={styles.year}>{item.info.year}</Text>
              <View style={styles.ratingContainer}>
                <View style={[styles.rating, { marginBottom: 8 }]}>
                  <Text style={styles.ratingKpText}>КР:</Text>
                  <Text style={{ color: "white" }}>
                    {item.info.rating.rating_kp}
                  </Text>
                </View>
                <View style={styles.rating}>
                  <Text style={[styles.ratingKpText, styles.ratingImbdText]}>
                    IMDb:
                  </Text>
                  <Text style={{ color: "white" }}>
                    {item.info.rating.rating_imdb}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </View>
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Год:</Text>
              <Text style={styles.text}>{item.info.year}</Text>
            </View>,
            "year"
          )}
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Страна:</Text>
              <Text style={styles.text}>{item.info.country}</Text>
            </View>,
            "country"
          )}
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Режиссёр:</Text>
              <Text style={styles.text}>{item.info.director}</Text>
            </View>,
            "director"
          )}
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Жанр:</Text>
              <Text style={styles.text}>{formatList(item.info.genre)}</Text>
            </View>,
            "genre"
          )}
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Слоган:</Text>
              <Text style={styles.text}>{item.info.slogan}</Text>
            </View>,
            "slogan"
          )}
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Премьера:</Text>
              <Text style={styles.text}>{item.info.premiere}</Text>
            </View>,
            "premiere"
          )}
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Длительность:</Text>
              <Text style={styles.text}>
                {formatTimeToMinutes(item.info.time)} минут
              </Text>
            </View>,
            "time"
          )}
          {renderProperty(
            <View style={styles.row}>
              <Text style={[styles.text, styles.key]}>Актёры:</Text>
              <Text style={styles.text}>{formatList(item.info.actors)}</Text>
            </View>,
            "actors"
          )}
          <View style={{ marginTop: 40, marginBottom: 30 }}>
            <Text style={[styles.text, styles.key]}>Описание:</Text>
            <Text style={[styles.text, { flex: 0 }]}>
              {item.info.description}
            </Text>
          </View>
          <View>
            {isFocused ? (
              <WebView
                originWhitelist={["*"]}
                javaScriptEnabled={true}
                injectedJavaScript={webViewScript}
                source={{
                  // html: `<body style="margin: 0 !important;padding: 0 !important;"><iframe src="https://top-kadr-web.vercel.app/movieiframe.html?link=${item.link}&token=${MovieService.token}" frameborder="0" hspace="0" vspace="0" marginheight="0" marginwidth="0" width="100%" height="100%"  style="border: 0; border-color: transparent;" scrolling="no" allowfullscreen="allowfullscreen"
                  // mozallowfullscreen="mozallowfullscreen"
                  // msallowfullscreen="msallowfullscreen"
                  // oallowfullscreen="oallowfullscreen"
                  // webkitallowfullscreen="webkitallowfullscreen"></iframe></body>`,
                  uri: `https://top-kadr-web.vercel.app/movieiframe.html?link=${item.link}&token=${MovieService.token}`,
                }}
                style={{ width: "100%", height: webViewHeight, opacity: 0.99 }}
                allowsFullscreenVideo={true}
                // pullToRefreshEnabled={true}
                // sharedCookiesEnabled={true}
                // geolocationEnabled={true}
                scrollEnabled={false}
                useWebKit={true}
                // androidHardwareAccelerationDisabled={true}
                // androidLayerType="hardware"
                onMessage={(event) => {
                  setWebViewHeight(Number(event.nativeEvent.data));
                }}
                mediaPlaybackRequiresUserAction={false}
              />
            ) : (
              <CentredActivityIndicator />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    color: "white",
    fontWeight: 900,
    marginLeft: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    paddingVertical: 10,
  },
  body: {
    marginHorizontal: 12,
    marginVertical: 20,
    backgroundColor: "black",
    borderRadius: 16,
    padding: 8,
    paddingBottom: 80,
  },
  name: {
    color: "white",
    fontSize: 26,
    marginTop: 20,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  key: {
    fontWeight: 900,
    marginRight: 6,
  },
  year: {
    marginTop: 4,
    marginRight: 6,
    textAlign: "right",
    fontWeight: 900,
    fontSize: 18,
    color: "white",
    fontFamily: "Impact,Arial,sans-serif",
  },
  ratingContainer: {
    marginTop: "100%",
    display: "flex",
    alignContent: "flex-end",
    width: "100%",
    flexDirection: "column",
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
});

export default WatchScreen;
