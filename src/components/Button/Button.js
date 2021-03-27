import React from "react";
import classNames from "classnames";

import styles from "./Button.scss";

const Button = ({ children, priority, onClick, disabled }) => {
  return (
    <button
      className={classNames(styles.button, styles[`button--${priority}`])}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
