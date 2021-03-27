import React, { useState, useEffect } from "react";

import { getChannelConfig } from "../../api/ebs.js";
import useTwitch from "../../hooks/useTwitch.js";
import DebugJSON from "../DebugJSON/DebugJSON.js";

const Config = () => {
  const { addPubSubEventListener } = useTwitch();
  const [config, setConfig] = useState(null);

  const fetchConfig = async () => {
    try {
      const { data } = await getChannelConfig();
      setConfig(data);
    } catch (err) {}
  };

  useEffect(() => {
    (async () => {
      addPubSubEventListener("activePrizeUpdate", fetchConfig());
      fetchConfig();
    })();
  }, []);

  const handleClickCreateCustomReward = () => {
    const connectUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.EBS_ENDPOINT}/setup-channel-points-reward&scope=channel:manage:redemptions`;
    window.open(connectUrl);
  };

  if (!config) {
    return (
      <div>
        <p>Channel is not set up for Just Spinning yet.</p>
        <button onClick={handleClickCreateCustomReward}>Create channel points reward</button>
        <button onClick={fetchConfig}>Re-check config</button>
      </div>
    );
  }

  return (
    <div>
      <p>Config screen</p>
      <DebugJSON data={config} />
    </div>
  );
};

export default Config;
