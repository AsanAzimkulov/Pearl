import React from "react";
import { Linking, View } from "react-native";
import { getVersion } from "react-native-device-info";
import { Text, useTheme } from "react-native-paper";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import DefaultSettingsButton from "../components/DefaultSettingsButton";

const AboutScreen = () => {
  const theme = useTheme();

    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <DefaultSettingsButton
          label="Пожертвовать"
          onPress={() =>
            Linking.openURL("https://teletype.in/@asanazimkulov/50ZyUJvCv7e")
          }
          iconName="gift-outline"
        />
        <DefaultSettingsButton
          label="Мой гитхаб"
          onPress={() => Linking.openURL("https://github.com/AsanAzimkulov")}
          iconName="github"
        />
        <DefaultSettingsButton
          label="Мы в ютубе"
          onPress={() => Linking.openURL("https://www.youtube.com/@top_kadr")}
          iconName="youtube"
        />
        <DefaultSettingsButton
          label="Мы в тиктоке"
          onPress={() => Linking.openURL("https://www.tiktok.com/@toopkadr")}
          iconName="music-note"
        />
        <DefaultSettingsButton
          label="Телеграм канал"
          onPress={() => Linking.openURL("https://t.me/toopkadr")}
          iconName="send"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 15,
          }}
        >
          <Text style={{ fontSize: 12, color: "grey" }}>
            Версия содержимого: {new Date().toISOString().split("T")[0]}
          </Text>
          <Text style={{ fontSize: 12, color: "grey" }}>
            Версия приложения: {getVersion()}
          </Text>
        </View>
      </View>
    );
};

export default AboutScreen;
