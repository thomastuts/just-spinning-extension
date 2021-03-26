import React, { useState, useEffect } from "react";

import { getChannelConfig } from "../../api/ebs.js";

const Config = () => {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getChannelConfig();
        setConfig(data);
      } catch (err) {}
    })();
  }, []);

  return (
    <div>
      <p>Config screen</p>
    </div>
  );
};

export default Config;
