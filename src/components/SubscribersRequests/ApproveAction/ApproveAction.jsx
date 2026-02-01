import React from "react";
import styles from "./ApproveAction.module.css";

const ApproveAction = ({ user, onConfirm, onCancel }) => (
    <div className={styles.approveView}>
        <div className={styles.approveIcon}>🚀</div>
        <h3>تفعيل باقة {user?.planName}</h3>
        <p>أنت على وشك تفعيل الاشتراك لشركة <strong>{user?.companyName}</strong>.</p>
        <div className={styles.confirmActions}>
            <button className={styles.successBtn} onClick={() => onConfirm(user.id)}>تأكيد التفعيل الآن</button>
            <button className={styles.cancelBtn} onClick={onCancel}>تراجع</button>
        </div>
    </div>
);
export default ApproveAction;