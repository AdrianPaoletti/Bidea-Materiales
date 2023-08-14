import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import { ThemeProvider } from "@mui/material/styles";

import ResourcesManagementContextProvider from "resources-management/core/store/context/ResourcesManagementContextProvider";
import store from "resources-management/core/store/redux";
import { defaultTheme } from "resources-management/styles/themes";

import "resources-management/styles/main.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ResourcesManagementContextProvider>
      <ThemeProvider theme={defaultTheme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </ResourcesManagementContextProvider>
  );
}
