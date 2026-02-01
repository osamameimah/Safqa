import React from "react";
import styles from "./DeletePlanModal.module.css";
import { toast } from "react-toastify";

const DeletePlanModal = ({ planName, onDelete, closeModal }) => {
    const handleConfirm = () => {
        onDelete();
        toast.error(`تم حذف المدير ${planName} بنجاح`, {
            icon: "🗑️"
        });
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
                    <h3 className={styles.title}>هل أنت متأكد من حذف {planName}؟</h3>
                    <p className={styles.subtitle}>سيتم حذف كافة البيانات المتعلقة بهذا المدير نهائياً.</p>
                </div>
            </div>

            <div className={styles.footerActions}>
                <button className={styles.confirmBtn} onClick={onDelete}>
                    نعم، حذف
                </button>
                <button className={styles.cancelBtn} onClick={closeModal}>
                    إلغاء
                </button>
            </div>
        </div>
    );
};

export default DeletePlanModal;