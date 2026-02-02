import React from "react";
import styles from "./DetailsView.module.css";

const DetailsView = ({ user }) => {
    if (!user) return null;

    const getFullStatusLabel = (status) => {
        switch (status) {
            case "active": return "اشتراك نشط";
            case "pending": return "بانتظار التفعيل";
            case "expired": return "اشتراك منتهي";
            case "cancelled": return "اشتراك ملغي";
            case "rejected": return "طلب مرفوض";
            default: return "حالة غير معروفة";
        }
    };

    return (
        <div className={styles.profileWrapper}>
            <div className={styles.profileHeader}>
                <div className={styles.largeAvatar}>{user.name.charAt(0)}</div>
                <div className={styles.headerInfo}>
                    <h2 className={styles.profileName}>{user.name}</h2>
                    <p className={styles.profileSubText}>{user.companyName}</p>
                     <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                        {user.status === "active" ? "نشط" :
                            user.status === "pending" ? "قيد الانتظار" :
                                user.status === "expired" ? "منتهي" :
                                    user.status === "cancelled" ? "ملغي" : "مرفوض"}
                    </span>
                </div>
            </div>

            <div className={styles.infoGrid}>
                <div className={styles.sectionTitle}>بيانات التواصل</div>
                <div className={styles.infoItem}><label>📧 البريد الإلكتروني</label><p>{user.email}</p></div>
                <div className={styles.infoItem}><label>📞 رقم الهاتف</label><p>{user.phone}</p></div>
                <div className={styles.infoItem}><label>📍 العنوان</label><p>{user.address}</p></div>

                <div className={styles.sectionTitle}>تفاصيل الباقة الحالية ({user.planName})</div>
                <div className={styles.infoItem}><label>📅 تاريخ البدء</label><p>{user.startDate}</p></div>
                <div className={styles.infoItem}><label>⏳ تاريخ الانتهاء</label><p>{user.endDate}</p></div>
                <div className={styles.infoItem}><label>👤 تم التفعيل بواسطة</label><p>{user.approvedBy || "---"}</p></div>
            </div>
        </div>
    );
};

export default DetailsView;