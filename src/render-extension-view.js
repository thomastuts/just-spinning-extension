import React from "react";
import ReactDOM from "react-dom";
//import * as Sentry from "@sentry/react";
//import { Integrations } from "@sentry/tracing";

import TwitchHelper from "./components/TwitchHelper/TwitchHelper";

import isHostedOnTwitch from "./util/is-hosted-on-twitch";

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
    <TwitchHelper useFakeTwitchHelperAPI={!isHostedOnTwitch()}>{children}</TwitchHelper>,
    document.getElementById("root")
  );
}
