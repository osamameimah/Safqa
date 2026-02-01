import React from "react";
import styles from "./ViewButton.module.css";

const ViewButton = ({ onClick, text = "التفاصيل" }) => (
  <button className={styles.btnView} onClick={onClick} title={text}>
    {text}
  </button>
);

export default ViewButton;