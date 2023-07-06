import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultSettingsButton from "../components/DefaultSettingsButton";

const SettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <DefaultSettingsButton
        label="Главные настройки"
        onPress={() => navigation.navigate("Главные настройки")}
        iconName="cogs"
      />
      <DefaultSettingsButton
        label="О нас"
        onPress={() => navigation.navigate("О нас")}
        iconName="information"
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
