import React from "react";
import { getQueue } from "../../api/ebs.js";
import Stack from "../Stack/Stack.js";

import styles from "./Queue.scss";

const Queue = ({ prizes, showBroadcasterActions, isStartButtonDisabled }) => {
  if (prizes.length === 0) {
    return <p>No queued players.</p>;
  }

  return (
    <Stack vertical spacing="default">
      <h2>Queued players</h2>
      <Stack vertical spacing="small">
        {prizes.map(prize => (
          <div className={styles.prize}>
            <div className={styles.prizeViewerName}>{prize.viewer_display_name}</div>
            <div className={styles.prizeActions}></div>
          </div>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <div>
      {prizes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Viewer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map(entry => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.viewer_display_name}</td>
                <td>
                  <button
                    disabled={isStartButtonDisabled}
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

export default Queue;
