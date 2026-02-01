import React from "react";
import styles from "./DeleteModal.module.css";
 
const DeleteModal = ({ adminName, onDelete, closeModal }) => {
    const handleConfirm = () => {
        onDelete();
    
        closeModal();
    };

    return (
        <div className={styles.deleteContent}>
            <div className={styles.mainRow}>
                 <div className={styles.warningIconWrapper}>
                    <div className={styles.iconCircle}>
                        <span className={styles.exclamation}>!</span>
                    </div>
                </div>

                <div className={styles.textContent}>
                    <h3 className={styles.title}>هل أنت متأكد من حذف {adminName}؟</h3>
                    <p className={styles.subtitle}>سيتم حذف كافة البيانات المتعلقة بهذا المدير نهائياً.</p>
                </div>
            </div>

            <div className={styles.footerActions}>
                <button className={styles.confirmBtn} onClick={handleConfirm}>
                    نعم، حذف
                </button>
                <button className={styles.cancelBtn} onClick={closeModal}>
                    إلغاء
                </button>
            </div>
        </div>
    );
};

export default DeleteModal;