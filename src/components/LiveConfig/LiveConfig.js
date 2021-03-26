import React, { useEffect, useState, useCallback } from "react";
import { fulfillPrize, getActivePrize, getQueue, startPrize } from "../../api/ebs.js";
import DebugJSON from "../DebugJSON/DebugJSON.js";

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
    <div style={{ background: "white" }}>
      {activePrize && (
        <React.Fragment>
          <DebugJSON data={activePrize} />
          <button onClick={handleFullfillActivePrize}>FULFILL</button>
          <hr />
        </React.Fragment>
      )}
      {queue.length === 0 && <p>No Just Spinning prizes queued.</p>}
      {queue.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Viewer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map(entry => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.viewer_display_name}</td>
                <td>
                  <button
                    disabled={isStartingPrize || activePrize}
                    onClick={() => handleStartPrizeInQueue(entry.id)}
                  >
                    START
                  </button>
                  <button>CANCEL</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LiveConfig;
