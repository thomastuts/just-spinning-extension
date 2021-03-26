import { useContext } from "react";

import { TwitchContextContext, TwitchAuthContext, TwitchBroadcastContext } from "../contexts";

export default function useTwitch() {
  const twitch = window.Twitch.ext;

  const auth = useContext(TwitchAuthContext);
  const context = useContext(TwitchContextContext);
  const { addPubSubEventListener, removePubSubEventListener } = useContext(TwitchBroadcastContext);

  return {
    auth,
    context,
    channelId: auth.channelId,
    actions: twitch.actions,
    viewer: twitch.viewer,
    role: twitch.viewer.role,
    addPubSubEventListener,
    removePubSubEventListener,
  };
}
