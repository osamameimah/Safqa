import React from "react";
import styles from "./DeleteButton.module.css";

const DeleteButton = ({ onClick }) => (
  <button className={styles.btnDelete} onClick={onClick} title="حذف">
    حذف
  </button>
);

export default DeleteButton;