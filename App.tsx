import * as React from "react";
import { Pressable } from "react-native";
import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "./src/screens/LoginScreen";
import { Provider, useSelector } from "react-redux";
import { persistor, RootState, store } from "./src/store";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { setupBackgroundSync } from "./src/utils/backgroundSync";
import { initDatabase } from "./src/database/DatabaseHelper";
import { useEffect } from "react";
import { NewPostScreen } from "./src/screens/NewPostScreen";
import { HomeScreen } from "./src/screens/HomeScreen";

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

function RootStack() {
  const user = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={user.isAuthenticated ? "Home" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{
            title: "Create New Post",
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitleAlign: "center",
            headerTitleStyle: { color: "white" },
            headerStyle: { backgroundColor: "black" },
            headerRight: () => (
              <Pressable
                style={{ flexDirection: "row" }}
                onPress={() => {
                  navigationRef.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    })
                  );
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="white" />
              </Pressable>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    initDatabase();
    setupBackgroundSync();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <RootStack />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
