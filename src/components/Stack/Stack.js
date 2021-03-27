import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import styles from "./Stack.scss";

const getSpacingClassForSpacingUnit = spacingUnit => {
  switch (spacingUnit) {
    case "extra-small":
      return styles.stackSpacingExtraSmall;
    case "small":
      return styles.stackSpacingSmall;
    case "default":
      return styles.stackSpacingDefault;
    case "large":
      return styles.stackSpacingLarge;
  }
};

const Stack = ({ as = "div", children, className, horizontal, vertical, spacing, ...rest }) => {
  const classes = classNames(
    styles.stack,
    {
      [styles.stackHorizontal]: horizontal,
      [styles.stackVertical]: vertical,
    },
    getSpacingClassForSpacingUnit(spacing),
    className
  );

  return React.createElement(as, {
    className: classes,
    children,
    ...rest,
  });
};

Stack.propTypes = {
  className: PropTypes.string,
  horizontal: PropTypes.bool,
  vertical: PropTypes.bool,
  spacing: PropTypes.oneOf(["extra-small", "small", "default", "large"]),
};

export default Stack;
