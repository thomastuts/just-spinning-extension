import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import * as Sentry from "@sentry/react";

import { setAuthToken, getFakeAuthToken } from "../../api/ebs";
import createFakeTwitchHelper from "../../util/create-fake-twitch-helper";
import { TwitchAuthContext, TwitchBroadcastContext, TwitchContextContext } from "../../contexts";

const TwitchHelper = ({ useFakeTwitchHelperAPI = false, children }) => {
  const [isInitialised, setIsInitialised] = useState(false);
  const [auth, setAuth] = useState(null);
  const [context, setContext] = useState(null);
  const listenersByTarget = useRef({});

  const addPubSubEventListener = (target, callback) => {
    if (!listenersByTarget.current[target]) {
      listenersByTarget.current[target] = [];
    }

    if (!listenersByTarget.current[target].find(cb => cb === callback)) {
      listenersByTarget.current[target].push(callback);
    }
  };

  const removePubSubEventListener = (target, callback) => {
    if (!listenersByTarget.current[target]) {
      return;
    }

    listenersByTarget.current[target] = listenersByTarget.current[target].filter(
      cb => cb !== callback
    );
  };

  useEffect(() => {
    (async () => {
      let twitchHelper = window.Twitch.ext;

      if (useFakeTwitchHelperAPI) {
        console.warn("INITIALIZED FAKE TWITCH HELPER");
        const queryParams = queryString.parse(window.location.search);
        const channelId = queryParams.channel_id || "demo";
        const userId = queryParams.user_id || "demo";

        const { data } = await getFakeAuthToken({ channelId: channelId, userId: userId });
        const fakeTwitchHelper = createFakeTwitchHelper({
          linkedViewerId: null,
          authResponse: {
            channelId,
            userId,
            clientId: process.env.TWITCH_CLIENT_ID,
            token: data.token,
          },
        });

        twitchHelper = fakeTwitchHelper;

        window.Twitch = {
          ext: fakeTwitchHelper,
        };
      }

      twitchHelper.listen("broadcast", async function(target, contentType, data) {
        const { event, payload } = JSON.parse(data);
        console.log("[Twitch broadcast]:", { event, payload });
        const listeners = listenersByTarget.current[event] || [];
        listeners.forEach(listener => listener(payload));
      });

      twitchHelper.onAuthorized(auth => {
        setAuthToken(auth.token);
        setAuth(auth);
        setIsInitialised(true);

        try {
          Sentry.setUser({ id: auth.userId });
          Sentry.setTag("channelId", auth.channelId);
          const version = window.pathname.split("/")[2];
          Sentry.setTag("extensionVersion", version || "NO_VERSION");
        } catch (err) {}
      });

      twitchHelper.onContext(context => {
        setContext(context);
      });
    })();
  }, []);

  if (!isInitialised) {
    return null;
  }

  const broadcastContextValue = {
    addPubSubEventListener,
    removePubSubEventListener,
  };

  return (
    <TwitchAuthContext.Provider value={auth}>
      <TwitchContextContext.Provider value={context}>
        <TwitchBroadcastContext.Provider value={broadcastContextValue}>
          {children}
        </TwitchBroadcastContext.Provider>
      </TwitchContextContext.Provider>
    </TwitchAuthContext.Provider>
  );
};

TwitchHelper.propTypes = {
  useFakeTwitchHelperAPI: PropTypes.bool,
};

export default TwitchHelper;
