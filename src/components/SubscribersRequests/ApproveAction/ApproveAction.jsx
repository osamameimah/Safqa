import React, { useState } from "react";
import styles from "./ApproveAction.module.css";

const ApproveAction = ({ user, onConfirm, onCancel }) => {
    const [selectedStatus, setSelectedStatus] = useState(user?.status || "pending");

    const options = [
        { id: "pending", name: "قيد الانتظار", color: "#eab308" },
        { id: "active", name: "تفعيل ", color: "#22c55e" },
        { id: "expired", name: "إنهاء  ", color: "#64748b" },
        { id: "cancelled", name: "إلغاء  ", color: "#f97316" },
        { id: "rejected", name: "رفض  ", color: "#ef4444" }
    ];

    return (
        <div className={styles.approveView}>
            <div className={styles.approveIcon}>⚙️</div>
            <h3>تعديل حالة الاشتراك</h3>
            <p>المشترك: <strong>{user?.name}</strong></p>

            <div className={styles.optionsList}>
                {options.map((opt) => (
                    <div
                        key={opt.id}
                        className={`${styles.optionItem} ${selectedStatus === opt.id ? styles.selected : ""}`}
                        onClick={() => setSelectedStatus(opt.id)}
                    >
                        <span className={styles.dot} style={{ backgroundColor: opt.color }}></span>
                        {opt.name}
                    </div>
                ))}
            </div>

            <div className={styles.confirmActions}>
                <button className={styles.successBtn} onClick={() => onConfirm(selectedStatus)}>
                    حفظ التغييرات
                </button>
                <button className={styles.cancelBtn} onClick={onCancel}>إلغاء</button>
            </div>
        </div>
    );
};

export default ApproveAction;