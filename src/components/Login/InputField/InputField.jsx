import React from "react";
import styles from "./InputField.module.css";

const InputField = ({ label, id, error, touched, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.inputLabel}>{label}</label>
      <input
        id={id}
        {...props}
        className={`${styles.inputField} ${touched && error ? styles.inputError : ""}`}
      />
      {touched && error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
};

export default InputField;