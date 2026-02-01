import React, { useState } from "react";
import styles from "./SubscribersTable.module.css";
import Pagination from "../../Pagination/Pagination";
import ViewButton from "../../CustomButton/ViewButton/ViewButton";
import EditButton from "../../CustomButton/EditButton/EditButton";
import DeleteButton from "../../CustomButton/DeleteButton/DeleteButton";

const SubscribersTable = ({ data = [], onOpenModal }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <div className={styles.tableContainer}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>المشترك / الشركة</th>
                            <th>نوع الباقة</th>
                            <th>رقم التواصل</th>
                             <th>الحالة</th>
                            <th style={{ textAlign: 'center' }}>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((sub) => (
                                <tr key={sub.id}>
                                     <td>
                                        <div className={styles.userCell}>
                                            {sub.photoUrl ? (
                                                <div className={styles.imageWrapper}>
                                                    <img
                                                        src={sub.photoUrl}
                                                        alt={sub.name}
                                                        className={styles.userImage}
                                                        onError={(e) => { e.target.style.display = 'none'; }}  
                                                    />
                                                </div>
                                            ) : (
                                                <div className={styles.avatar}>{sub.name?.charAt(0)}</div>
                                            )}
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{sub.name}</span>
                                                <span className={styles.companyName}>{sub.company}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className={styles.planNameTable}>{sub.plan}</span></td>
                                    <td>{sub.phone}</td>
                                     <td>
                                        <span className={sub.status === "نشط" ? styles.badgeActive : styles.badgeExpired}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <ViewButton onClick={() => onOpenModal('details', sub)} />
                                            <EditButton onClick={() => onOpenModal('edit', sub)} />
                                            <DeleteButton onClick={() => onOpenModal('delete', sub)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                                    📭 لا توجد بيانات لعرضها
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
        </>
    );
};

export default SubscribersTable;