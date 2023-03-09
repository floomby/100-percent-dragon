import { type AppType } from "next/dist/shared/lib/utils";
import { store } from "~/redux/store";
import { Provider } from "react-redux";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default MyApp;
