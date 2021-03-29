import React from "react";
import ReactDOM from "react-dom";
import Stack from "./components/Stack/Stack.js";
//import * as Sentry from "@sentry/react";
//import { Integrations } from "@sentry/tracing";

import TwitchHelper from "./components/TwitchHelper/TwitchHelper";

import isHostedOnTwitch from "./util/is-hosted-on-twitch";
import Logo from "./images/logo.svg";

//Sentry.init({
//  dsn: process.env.SENTRY_DSN,
//  integrations: [new Integrations.BrowserTracing()],
//
//  // We recommend adjusting this value in production, or using tracesSampler
//  // for finer control
//  tracesSampleRate: 1.0,
//});

//if (!isHostedOnTwitch()) {
//  document.body.classList.add(styles.fakeBackground);
//}

import "./global-styles.scss";

export default function renderExtensionView(children) {
  ReactDOM.render(
    <TwitchHelper useFakeTwitchHelperAPI={!isHostedOnTwitch()}>
      <Stack vertical spacing="default">
        <div style={{ textAlign: "center" }}>
          <Logo width={150} />
        </div>
        <div style={{ margin: "0 auto", maxWidth: 400 }}>{children}</div>
      </Stack>
    </TwitchHelper>,
    document.getElementById("root")
  );
}
