import React from "react";
import styles from "./AddButton.module.css";

const AddButton = ({ text, onClick }) => {
  return (
    <button className={styles.addNewBtn} onClick={onClick}>
      <span className={styles.icon}>+</span>
      {text}
    </button>
  );
};

export default AddButton;