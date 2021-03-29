import React, { useEffect, useState } from "react";
import { getQueue, startPrize } from "../../api/ebs.js";
import useTwitch from "../../hooks/useTwitch.js";
import Button from "../Button/Button.js";

import Stack from "../Stack/Stack.js";
import DeleteSvgIcon from "../../icons/delete.svg";
import PlaySvgIcon from "../../icons/play.svg";

import styles from "./Queue.scss";

const Queue = () => {
  const { role } = useTwitch();
  const [queue, setQueue] = useState([]);
  const [isStartingPrize, setIsStartingPrize] = useState(false);
  const { addPubSubEventListener, removePubSubEventListener } = useTwitch();

  useEffect(() => {
    const fetchQueue = async () => {
      setIsStartingPrize(true);
      try {
        const { data: queueData } = await getQueue();
        setQueue(queueData);
      } catch (err) {
      } finally {
        setIsStartingPrize(false);
      }
    };

    addPubSubEventListener("activePrizeUpdate", fetchQueue);
    addPubSubEventListener("queueUpdate", fetchQueue);

    (() => {
      fetchQueue();
    })();

    return () => {
      removePubSubEventListener("activePrizeUpdate", fetchQueue);
      removePubSubEventListener("queueUpdate", fetchQueue);
    };
  }, []);

  const handleStartPrize = async prizeId => {
    await startPrize(prizeId);
  };

  const showBroadcasterActions = role === "broadcaster";

  return (
    <Stack vertical spacing="default">
      <h2>Queued players</h2>
      {queue.length === 0 && (
        <p style={{ textAlign: "center" }}>
          Nobody is in the queue for Just Spinning. To join, use your Channel Points on the Just
          Spinning reward!
        </p>
      )}
      <Stack vertical spacing="small">
        {queue.map(prize => (
          <div className={styles.prize}>
            <div className={styles.prizeViewerName}>{prize.viewer_display_name}</div>
            {showBroadcasterActions && (
              <Stack horizontal spacing="small" className={styles.prizeActions}>
                <Button
                  priority="primary"
                  disabled={isStartingPrize}
                  onClick={() => handleStartPrize(prize.id)}
                >
                  <PlaySvgIcon width={16} />
                </Button>
                <Button priority="secondary" onClick={() => onCancelPrize(prize.id)}>
                  <DeleteSvgIcon width={16} />
                </Button>
              </Stack>
            )}
          </div>
        ))}
      </Stack>
    </Stack>
  );
};

export default Queue;
