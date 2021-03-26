import React from "react";

const DebugJSON = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>;

export default DebugJSON;
