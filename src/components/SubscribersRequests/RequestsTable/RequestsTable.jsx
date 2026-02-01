import React, { useState, useEffect } from "react";
import styles from "./RequestsTable.module.css";
import Pagination from "../../Pagination/Pagination";
import DeleteButton from "../../CustomButton/DeleteButton/DeleteButton";
import ViewButton from "../../CustomButton/ViewButton/ViewButton";
import ApproveButton from "../../CustomButton/ApproveButton/ApproveButton";

const RequestsTable = ({ data = [], onOpenModal }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // حساب إجمالي الصفحات مرة واحدة لاستخدامه في الكود
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

    // تعديل: العودة للصفحة السابقة إذا تم حذف آخر عنصر في الصفحة الحالية
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [data.length, totalPages, currentPage]);

    // حساب نطاق العناصر المعروضة
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

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
                            currentItems.map((sub) => (
                                <tr key={sub.id}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatar}>
                                                {sub.name?.charAt(0).toUpperCase() || "?"}
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{sub.name}</span>
                                                <span className={styles.companyName}>{sub.companyName}</span>
                                                <span className={styles.userEmail}>{sub.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.planBadge}>{sub.planName}</span>
                                    </td>
                                    <td>
                                         {sub.endDate ? sub.endDate.split('T')[0] : "---"}
                                    </td>
                                    <td>
                                        <span className={sub.status === "active" ? styles.badgeActive : styles.badgePending}>
                                            {sub.status === "active" ? "نشط" : "قيد الانتظار"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            {sub.status !== "active" && (
                                                <ApproveButton onClick={() => onOpenModal('approve', sub)} />)}
                                            <ViewButton onClick={() => onOpenModal('details', sub)} />
                                            <DeleteButton onClick={() => onOpenModal('delete', sub)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={styles.noDataCell}>
                                    <div className={styles.noDataWrapper}>
                                        <span>📭 لا توجد طلبات اشتراك حالياً</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

             {data.length > itemsPerPage && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </>
    );
};

export default RequestsTable;