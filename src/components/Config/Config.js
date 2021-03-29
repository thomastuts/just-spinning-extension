import React, { useState, useEffect } from "react";

import { getChannelConfig } from "../../api/ebs.js";
import useTwitch from "../../hooks/useTwitch.js";
import Button from "../Button/Button.js";
import DebugJSON from "../DebugJSON/DebugJSON.js";
import Stack from "../Stack/Stack.js";

import styles from "./Config.scss";

console.log(styles);

const Config = () => {
  const { addPubSubEventListener, channelId } = useTwitch();
  const [config, setConfig] = useState(null);

  const fetchConfig = async () => {
    try {
      const { data } = await getChannelConfig();
      setConfig(data);
    } catch (err) {}
  };

  useEffect(() => {
    (async () => {
      addPubSubEventListener("configUpdate", fetchConfig);
      fetchConfig();
    })();
  }, []);

  const handleClickCreateCustomReward = () => {
    const connectUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.EBS_ENDPOINT}/setup-channel-points-reward&scope=channel:manage:redemptions`;
    window.open(connectUrl);
  };

  const obsUrl = `${process.env.VIEWER_URL}?channel_id=${channelId}`;

  return (
    <div className={styles.wrapper}>
      <Stack vertical spacing="default">
        <h2>Configuration</h2>
        {config && (
          <Stack vertical spacing="default">
            <p>
              Your channel is set up for Just Spinning! If you want to adjust the cost of the
              reward, you can do so in your Creator Dashboard.
            </p>
            <div className={styles.obsHintWrapper}>
              <Stack vertical spacing="default">
                <p>
                  Add the following URL as a Browser Source in OBS, and make sure to check 'Control
                  Audio via OBS':
                </p>
                <a href={obsUrl} target="_blank" className={styles.obsUrl}>
                  {obsUrl}
                </a>
              </Stack>
            </div>
          </Stack>
        )}
        {!config && (
          <Stack vertical spacing="default">
            <p>
              It looks like your channel is not set up for Just Spinning yet. Please click the
              button below to create the custom Channel Points reward.
            </p>
            <Button priority="primary" onClick={handleClickCreateCustomReward}>
              Create channel points reward
            </Button>
            <Button priority="secondary" onClick={fetchConfig}>
              Refresh configuration
            </Button>
            {/*<button onClick={fetchConfig}>Re-check config</button>*/}
          </Stack>
        )}
        {/*<p>Config screen</p>*/}
        {/*<DebugJSON data={config} />*/}
      </Stack>
    </div>
  );
};

export default Config;
