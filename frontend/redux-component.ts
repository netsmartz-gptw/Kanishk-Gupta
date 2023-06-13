import dynamicLinks from "@react-native-firebase/dynamic-links";
import React, { Suspense } from "react";
import { Platform } from "react-native";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import persistStore from "redux-persist/es/persistStore";
import { PersistGate } from "redux-persist/integration/react";
import BuckOneApp from "./src";
import Loader from "./src/components/Loader";
import NavigationRoute from "./src/constants/navigationRoutes";
import { injectStore } from "./src/helpers/APIClient";
import store from "./src/redux/store";
import { navigate } from "./src/router";

const App: React.FC = () => {
  const persister = persistStore(store);
  injectStore(store);
  const url: string =
    Platform.OS === "ios"
      ? "https://apps.apple.com/us/app/itunes-connect/id376771144"
      : "https://play.google.com/store/apps/details?id=com.droid.base10";
  const handleDynamicLink = (link: any) => {
    if (link?.url === url) {
      navigate(NavigationRoute.ChildWelcome, {
        hashValue: link?.utmParameters.utm_campaign,
      });
    }
  };

  dynamicLinks()
    .getInitialLink()
    .then((link) => {
      if (link?.url === url) {
        navigate(NavigationRoute.ChildWelcome, {
          hashValue: link?.utmParameters.utm_campaign,
        });
      }
    });

  dynamicLinks().onLink(handleDynamicLink);
  // When the component is unmounted, remove the listener

  return (
    <Suspense fallback={Loader}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persister}>
          <BuckOneApp />
        </PersistGate>
      </Provider>
    </Suspense>
  );
};

export default App;
