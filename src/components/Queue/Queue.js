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

    (() => {
      fetchQueue();
    })();

    return () => {
      removePubSubEventListener("activePrizeUpdate", fetchQueue);
    };
  }, []);

  const handleStartPrize = async prizeId => {
    await startPrize(prizeId);
  };

  const showBroadcasterActions = role === "broadcaster";

  if (queue.length === 0) {
    return <p>No queued players.</p>;
  }

  return (
    <Stack vertical spacing="default">
      <h2>Queued players</h2>
      <Stack vertical spacing="small">
        {queue.map(prize => (
          <div className={styles.prize}>
            <div className={styles.prizeViewerName}>{prize.viewer_display_name}</div>
            {showBroadcasterActions && (
              <div className={styles.prizeActions}>
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
              </div>
            )}
          </div>
        ))}
      </Stack>
    </Stack>
  );
};

export default Queue;
