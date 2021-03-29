import Pusher from "pusher-js";

let context = {
  arePlayerControlsVisible: false,
  bitrate: 5000,
  bufferSize: 100,
  displayResolution: "1280x720",
  game: "Don't Starve",
  hlsLatencyBroadcaster: 5,
  isFullScreen: false,
  isMuted: false,
  isPaused: false,
  isTheatreMode: false,
  language: "en",
  mode: "viewer",
  playbackMode: "video",
  theme: "light",
  videoResolution: "1280x720",
  volume: 0.5,
};
let contextHandler = null;

const listenCallbacksByTarget = {};

function receiveFakePubSub(target, data) {
  const listeners = listenCallbacksByTarget[target] || [];
  console.log(listeners);
  listeners.forEach(listener => listener(null, null, data));
}

export default function createFakeTwitchHelper({
  role = "broadcaster",
  linkedViewerId = null,
  authResponse,
}) {
  Pusher.logToConsole = true;

  const pusher = new Pusher(process.env.FAKE_TWITCH_PUBSUB_PUSHER_KEY, {
    cluster: "eu",
  });

  const channel = pusher.subscribe(authResponse.channelId);
  channel.bind("broadcast", function(data) {
    receiveFakePubSub("broadcast", JSON.stringify(data));
  });

  return {
    receiveFakePubSub: receiveFakePubSub,
    listen: (target, callback) => {
      if (!listenCallbacksByTarget[target]) {
        listenCallbacksByTarget[target] = [];
      }

      console.log("Adding listener for", target);

      listenCallbacksByTarget[target].push(callback);
    },
    onAuthorized: fn => {
      fn(authResponse);
    },
    updateContext: updatedContext => {
      if (contextHandler) {
        context = { ...context, ...updatedContext };
        contextHandler(context);
      }
    },
    onContext: fn => {
      contextHandler = fn;
      fn(context);
    },
    viewer: {
      isLinked: Boolean(linkedViewerId),
      role,
    },
    actions: {
      requestIdShare: () => {
        console.log("TODO: implement");
      },
    },
  };
}
