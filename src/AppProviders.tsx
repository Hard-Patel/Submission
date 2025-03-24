/**
 * @format
 */
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { persistor, store } from "./redux/store";
import { ThemeProvider } from "theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { SearchContextProvider } from "./Providers/SearchContext";
import { NetworkProvider } from "react-native-offline";
import { SocketProvider } from "./Providers/SocketProvider";

interface ProvideProps {
  children: JSX.Element | JSX.Element[];
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10000 } },
});

function AppProviders(props: ProvideProps) {
  const { children } = props;

  return (
    <NetworkProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SafeAreaProvider>
                <SocketProvider>
                  <SearchContextProvider>{children}</SearchContextProvider>
                </SocketProvider>
              </SafeAreaProvider>
            </PersistGate>
          </Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </NetworkProvider>
  );
}

export { AppProviders, queryClient };
