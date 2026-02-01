import React from "react";
import styles from "./EditButton.module.css";

const EditButton = ({ onClick }) => (
  <button className={styles.btnEdit} onClick={onClick} title="تعديل">
    تعديل
  </button>
);

export default EditButton;