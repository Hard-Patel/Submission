/**
 * @format
 */
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

interface ProvideProps {
  children: JSX.Element | JSX.Element[];
}

function AppProviders(props: ProvideProps) {
  const { children } = props;
  console.log('here in app providers', children);
  

  return (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
    </Provider>
  );
}

export { AppProviders };
