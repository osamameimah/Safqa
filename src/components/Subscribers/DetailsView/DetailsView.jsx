import React from "react";
import styles from "./DetailsView.module.css";

const DetailsView = ({ user, onEdit }) => (
    <div className={styles.profileWrapper}>
        <div className={styles.profileHeader}>
            <div className={styles.largeAvatar}>{user?.name?.charAt(0)}</div>
            <div className={styles.headerInfo}>
                <h2 className={styles.profileName}>{user?.name}</h2>
                <span className={user?.status === "نشط" ? styles.statusBadgeActive : styles.statusBadgeExpired}>
                    {user?.status}
                </span>
            </div>
        </div>
        <div className={styles.infoGrid}>
            <div className={styles.infoItem}><label>🏢 اسم الشركة</label><p>{user?.company}</p></div>
            <div className={styles.infoItem}><label>📞 رقم الجوال</label><p>{user?.phone}</p></div>
            <div className={styles.infoItem}><label>📧 البريد الإلكتروني</label><p>{user?.email}</p></div>
            <div className={styles.infoItem}><label>📍 العنوان</label><p>{user?.address}</p></div>
            <div className={styles.infoItem}><label>💎 نوع الباقة</label><p className={styles.planName}>{user?.plan}</p></div>
            <div className={styles.infoItem}><label>⏳ تاريخ النهاية</label><p>{user?.endDate}</p></div>
        </div>
        <div className={styles.profileFooter}>
            <button className={styles.editProfileBtn} onClick={() => onEdit('edit', user)}>✏️ تعديل البيانات</button>
        </div>
    </div>
);
export default DetailsView;