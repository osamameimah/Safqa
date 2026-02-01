import React from "react";
import styles from "./DetailsView.module.css";

const DetailsView = ({ user }) => {
    if (!user) return null;

    return (
        <div className={styles.profileWrapper}>
            <div className={styles.profileHeader}>
                <div className={styles.largeAvatar}>{user.name.charAt(0)}</div>
                <div className={styles.headerInfo}>
                    <h2 className={styles.profileName}>{user.name}</h2>
                    <p className={styles.profileSubText}>{user.companyName}</p>
                    <span className={user.status === "active" ? styles.statusBadgeActive : styles.statusBadgePending}>
                        {user.status === "active" ? "اشتراك نشط" : "بإنتظار التفعيل"}
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
                <div className={styles.infoItem}><label>👤 تم التفعيل</label><p>{user.approvedBy}</p></div>

     
            </div>
        </div>
    );
};

export default DetailsView;