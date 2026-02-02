import React from "react";
import styles from "./ApproveButton.module.css";

const ApproveButton = ({ onClick, text = "الحالة" }) => (
  <button className={styles.btnApprove} onClick={onClick} title={text}>
    {text}
  </button>
);

export default ApproveButton;