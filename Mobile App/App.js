import { getPaletteSync } from "@assembless/react-native-material-you";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import {
  MD3DarkTheme as DefaultTheme,
  Provider as PaperProvider,
  useTheme,
} from "react-native-paper";
import { Storage } from "./src/components/Storage";
import AboutScreen from "./src/screens/AboutScreen";
import GeneralSettingsScreen from "./src/screens/GeneralSettingsScreen";
import LoadingScreen from "./src/screens/LoadingScreen";
import SelectScreen from "./src/screens/SelectScreen";
import TabScreen from "./src/screens/TabScreen";
import WatchScreen from "./src/screens/WatchScreen";
import WeCimaExtractionScreen from "./src/screens/WeCimaExtractionScreen";
import appConfigService from "./src/services/AppConfigService";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  const theme = useTheme();
  if (appConfigService) console.log("true");

  return (
    <Stack.Navigator
      initialRouteName={"Tab"}
      screenOptions={{
        statusBarColor: theme.dark ? "black" : "white",
        statusBarStyle: theme.dark ? "light" : "dark",
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.dark ? "white" : "black",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animationEnabled: false,
      }}
    >
      <Stack.Screen
        name="Tab"
        component={TabScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Смотреть фильм"
        component={WatchScreen}
        options={{
          headerShown: false,
          orientation: "all",
          statusBarHidden: true,
          navigationBarHidden: true,
        }}
      />
      <Stack.Screen
        name="Select"
        component={SelectScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WeCima Extraction"
        component={WeCimaExtractionScreen}
        options={{ headerShown: false, animation: "none" }}
      />
      <Stack.Screen
        name="Главные настройки"
        component={GeneralSettingsScreen}
      />
      <Stack.Screen name="О нас" component={AboutScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  if (!Storage.contains("pureBlack")) {
    Storage.set("pureBlack", true);
  } else {
    // pass
  }

  const palette = getPaletteSync();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: palette.system_accent1[5],
      background: Storage.getBoolean("pureBlack")
        ? "black"
        : "rgba(28, 27, 31, 1)",
      elevation: {
        level4: palette.system_accent1[4] + "3C",
      },
      secondaryContainer: palette.system_accent1[4] + "3C",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
