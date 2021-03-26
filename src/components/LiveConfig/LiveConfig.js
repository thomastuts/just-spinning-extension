import React, { useEffect, useState, useCallback } from "react";
import { fulfillPrize, getActivePrize, getQueue, startPrize } from "../../api/ebs.js";
import DebugJSON from "../DebugJSON/DebugJSON.js";
import Queue from "../Queue/Queue.js";

const LiveConfig = () => {
  const [isStartingPrize, setIsStartingPrize] = useState(false);
  const [activePrize, setActivePrize] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: queueData } = await getQueue();
        setQueue(queueData);

        const { data: activePrizeData } = await getActivePrize();
        setActivePrize(activePrizeData);
      } catch (err) {}
    })();
  }, []);

  const handleStartPrizeInQueue = async prizeId => {
    await startPrize(prizeId);
  };

  const handleFullfillActivePrize = useCallback(async () => {
    await fulfillPrize(activePrize.id);
  }, [activePrize]);

  return (
    <React.Fragment>
      {activePrize && (
        <React.Fragment>
          <DebugJSON data={activePrize} />
          <button onClick={handleFullfillActivePrize}>FULFILL</button>
          <hr />
        </React.Fragment>
      )}
      <Queue prizes={queue} isStartButtonDisabled={activePrize || isStartingPrize} />
    </React.Fragment>
  );
};

export default LiveConfig;
