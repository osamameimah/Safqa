import React, { useState, useEffect } from "react";
import styles from "./RequestsTable.module.css";
import Pagination from "../../Pagination/Pagination";
import DeleteButton from "../../CustomButton/DeleteButton/DeleteButton";
import ViewButton from "../../CustomButton/ViewButton/ViewButton";
import ApproveButton from "../../CustomButton/ApproveButton/ApproveButton";

const RequestsTable = ({ data = [], onOpenModal }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [data.length, totalPages, currentPage]);

    const currentItems = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // توحيد مسميات الحالات بالعربي
    const statusMap = {
        active: { label: "نشط", class: styles.badgeActive },
        pending: { label: "قيد الانتظار", class: styles.badgePending },
        expired: { label: "منتهي", class: styles.badgeExpired },
        cancelled: { label: "ملغي", class: styles.badgeCancelled },
        rejected: { label: "مرفوض", class: styles.badgeRejected }
    };

    return (
        <>
            <div className={styles.tableContainer}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>المشترك والشركة</th>
                            <th>الباقة</th>
                            <th>تاريخ النهاية</th>
                            <th>الحالة</th>
                            <th style={{ textAlign: 'center' }}>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((sub) => {
                                const statusInfo = statusMap[sub.status] || { label: sub.status, class: styles.badgePending };
                                return (
                                    <tr key={sub.id}>
                                        <td>
                                            <div className={styles.userCell}>
                                                <div className={styles.avatar}>{sub.name?.charAt(0)}</div>
                                                <div className={styles.userInfo}>
                                                    <span className={styles.userName}>{sub.name}</span>
                                                    <span className={styles.companyName}>{sub.companyName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className={styles.planBadge}>{sub.planName}</span></td>
                                        <td>{sub.endDate ? sub.endDate.split('T')[0] : "---"}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${statusInfo.class}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                {/* زر تعديل الحالة متاح دائماً الآن */}
                                                <ApproveButton onClick={() => onOpenModal('status', sub)} />
                                                <ViewButton onClick={() => onOpenModal('details', sub)} />
                                                <DeleteButton onClick={() => onOpenModal('delete', sub)} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>لا توجد بيانات</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {data.length > itemsPerPage && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
        </>
    );
};

export default RequestsTable;