import React from "react";
import styles from "./LoginHeader.module.css";
import Fawateer from "../../../assets/Logo.png";

const LoginHeader = () => (
  <header className={styles.formHeader}>
    <img src={Fawateer} alt="logo" className={styles.logoImg} />
    <div className={styles.headerText}>
      <h1>منصة صفقة</h1>
      <p>منصة إلكترونية لإدارة فواتير المستفيدين</p>
    </div>
  </header>
);

export default LoginHeader;