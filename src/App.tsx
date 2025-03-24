/**
 * @format
 */
import React from "react";
import { LogBox, StyleProp, Text, TextInput, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProviders } from "./AppProviders";
import NavContainer from "../src/navigation";
import { NativeBaseProvider } from "native-base";
import { useAppTheme } from "../src/theme";
import FlashMessage from "react-native-flash-message";
import { GlobalLoader } from "../src/components/GlobalLoader";
import { CustomModalBox } from "components/CustomModalBox";
import { firebase } from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { OfflineBar } from "components/OfflineBar";
import { useGlobalLoaderActions } from "./redux/globalLoader";

LogBox.ignoreLogs(["Virtualized", "In React 18, SSRProvider"]);

function SubApp() {
  const theme = useAppTheme();
  const {toggleGlobalLoader} = useGlobalLoaderActions();

  React.useEffect(()=>{
    toggleGlobalLoader({visible: false});
  }, [])

  return (
    <NativeBaseProvider theme={theme}>
      <NavContainer />
      <GlobalLoader />
      <CustomModalBox />
      <GlobalLoader />
      <OfflineBar />
    </NativeBaseProvider>
  );
}

interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}
interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: { allowFontScaling?: boolean };
}

function App() {
  const disableScaling = () => {
    (Text as unknown as TextWithDefaultProps).defaultProps =
      (Text as unknown as TextWithDefaultProps).defaultProps || {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling =
      false;
    (TextInput as unknown as TextInputWithDefaultProps).defaultProps =
      (TextInput as unknown as TextInputWithDefaultProps).defaultProps || {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (
      TextInput as unknown as TextInputWithDefaultProps
    ).defaultProps!.allowFontScaling = false;
  };

  const createCustomChannel = async () => {
    await notifee.createChannel({
      id: "energizer_app",
      name: "energizer",
      sound: "custom",
      lights: false,
      vibration: true,
      importance: AndroidImportance.DEFAULT,
    });
  };

  React.useEffect(() => {
    disableScaling();
    createCustomChannel();
  }, []);

  const style: StyleProp<ViewStyle> = { flex: 1 };

  return (
    <GestureHandlerRootView style={style}>
      <AppProviders>
        <SubApp />
      </AppProviders>
      <FlashMessage position="top" />
    </GestureHandlerRootView>
  );
}

export default App;
