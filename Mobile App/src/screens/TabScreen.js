import { getPaletteSync } from "@assembless/react-native-material-you";
import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import SearchScreen from "./SearchScreen";
import SettingsScreen from "./SettingsScreen";
import WatchlistScreen from "./WatchlistScreen";

const TabScreen = ({ navigation }) => {
  const palette = getPaletteSync();
  let progress = 0;
  const common = require("../data/common.json");
  const [contentUpdated, setContentUpdated] = useState(false);
  const [index, setIndex] = useState(0);

  const fileUrls = common.fileUrlsFasel;

  const [routes] = useState([
    // {
    // 	key: "home",
    // 	title: "Home",
    // 	focusedIcon: "home",
    // 	unfocusedIcon: "home-outline",
    // },
    {
      key: "explore",
      title: "Поиск",
      focusedIcon: "compass",
      unfocusedIcon: "compass-outline",
    },
    {
      key: "mylist",
      title: "Избранные",
      focusedIcon: "bookmark-minus",
      unfocusedIcon: "bookmark-minus-outline",
    },
    // {
    // 	key: "entireSeasonDownload",
    // 	title: "Season Download",
    // 	focusedIcon: "download",
    // 	unfocusedIcon: "download-outline",
    // },
    {
      key: "settings",
      title: "Настройки",
      focusedIcon: "cog",
      unfocusedIcon: "cog-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    // home: () => {
    // 	return <TrendingContentScreen navigation={navigation} />;
    // },
    explore: () => {
      return <SearchScreen navigation={navigation} />;
    },
    mylist: () => {
      return <WatchlistScreen navigation={navigation} />;
    },
    // entireSeasonDownload: () => {
    // 	return <EntireSeasonDownloadScreen navigation={navigation} />;
    // },
    settings: () => {
      return <SettingsScreen navigation={navigation} />;
    },
  });

  // const updateContent = () => {
  // 	fileUrls.forEach(url => {
  // 		const fileName = url.split("/").slice(-1)[0];
  // 		ReactNativeBlobUtil.config({
  // 			path: ReactNativeBlobUtil.fs.dirs.DocumentDir + "/" + fileName,
  // 		})
  // 			.fetch("GET", url)
  // 			.then(() => {
  // 				progress++;
  // 				if (progress == fileUrls.length) {
  // 					setContentUpdated(true);
  // 				} else {
  // 					// pass
  // 				}
  // 			});
  // 	});
  // };

  // fetch(
  // 	"https://raw.githubusercontent.com/N0-0NE-Dev/no-fasel-scrapers/main/output/last-scraped.txt",
  // )
  // 	.then(response => response.text())
  // 	.then(text => {
  // 		const newestDate = new Date(text);
  // 		ReactNativeBlobUtil.fs
  // 			.readFile(ReactNativeBlobUtil.fs.dirs.DocumentDir + "/last-scraped.txt")
  // 			.then(date => {
  // 				const currentDate = new Date(date);

  // 				if (newestDate > currentDate) {
  // 					updateContent();
  // 				} else {
  // 					setContentUpdated(true);
  // 				}
  // 			})
  // 			.catch(() => updateContent());
  // 	});

  // if (!Storage.contains("useProxy")) {
  // 	Storage.set("useProxy", false);
  // } else {
  // 	// pass
  // }

  // if (!Storage.contains("resume")) {
  // 	Storage.set("resume", JSON.stringify({}));
  // } else {
  // 	// pass
  // }

  // if (!Storage.contains("watchlist")) {
  // 	Storage.set("watchlist", JSON.stringify({}));
  // } else {
  // 	// pass
  // }

  if (true) {
    return (
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        shifting={true}
        activeColor={palette.system_accent1[5]}
      />
    );
  } else {
    return <CentredActivityIndicator />;
  }
};

export default TabScreen;
