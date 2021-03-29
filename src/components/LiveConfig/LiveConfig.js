import React, { useEffect, useState, useCallback } from "react";
import { fulfillPrize, getActivePrize, getQueue, startPrize } from "../../api/ebs.js";
import useTwitch from "../../hooks/useTwitch.js";
import Button from "../Button/Button.js";

import DebugJSON from "../DebugJSON/DebugJSON.js";
import Queue from "../Queue/Queue.js";
import Stack from "../Stack/Stack.js";

import styles from "./LiveConfig.scss";

const HUMANIZED_PRIZE_NAMES = {
  ICEBREAKER: "Icebreaker",
  GUESS_THE_WORD: "Slow Burn",
  FILL_IN_THE_BLANK: "Shooting Blanks",
  ONELINER: "Putting it on the Line",
  LEGS_OR_HOTDOGS: "Legs or Hotdogs",
};

const LiveConfig = () => {
  const [activePrize, setActivePrize] = useState(null);
  const { addPubSubEventListener, removePubSubEventListener } = useTwitch();

  useEffect(() => {
    const fetchActivePrize = async () => {
      console.log("fetchActivePrize");
      try {
        const { data: activePrizeData } = await getActivePrize();
        setActivePrize(activePrizeData);
      } catch (err) {
        setActivePrize(null);
      }
    };

    addPubSubEventListener("activePrizeUpdate", fetchActivePrize);

    (async () => {
      fetchActivePrize();
    })();

    return () => {
      removePubSubEventListener("activePrizeUpdate", fetchActivePrize);
    };
  }, []);

  const handleFullfillActivePrize = useCallback(async () => {
    await fulfillPrize(activePrize.id);
  }, [activePrize]);

  const handleRefundActivePrize = useCallback(async () => {
    console.log("TO IMPLEMENT");
    //await fulfillPrize(activePrize.id);
  }, [activePrize]);

  return (
    <Stack vertical spacing="large">
      {activePrize && (
        <Stack vertical spacing="small">
          <h2>Active game</h2>
          <div className={styles.activeGameContainer}>
            <Stack vertical spacing="default">
              <div>
                <label>Viewer</label>
                <div className={styles.highlight}>{activePrize.viewer_display_name}</div>
              </div>
              <div>
                <label>Game type</label>
                <div className={styles.highlight}>{HUMANIZED_PRIZE_NAMES[activePrize.type]}</div>
              </div>
              <div className={styles.actions}>
                <Button priority="secondary" onClick={handleRefundActivePrize}>
                  Refund
                </Button>
                <Button priority="primary" onClick={handleFullfillActivePrize}>
                  Finish
                </Button>
              </div>
            </Stack>
          </div>
        </Stack>
      )}
      <Queue />
    </Stack>
  );
};

export default LiveConfig;
