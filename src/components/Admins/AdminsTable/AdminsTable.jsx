import React from "react";
import styles from "./AdminsTable.module.css";
import Pagination from "../../Pagination/Pagination";
import EditButton from "../../CustomButton/EditButton/EditButton";
import DeleteButton from "../../CustomButton/DeleteButton/DeleteButton";

const AdminsTable = ({ admins, onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
    return (
        <>
            <div className={styles.tableContainer}>
                <table className={styles.customTable}>
                    <thead>
                        <tr>
                            <th>اسم المدير</th>
                            <th>الايميل</th>
                            <th>رقم الجوال</th>
                            <th style={{ textAlign: 'center' }}>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.length > 0 ? (
                            admins.map((admin) => (
                                <tr key={admin.id}>
                                    <td className={styles.userName}>{admin.name}</td>
                                    <td className={styles.userEmail}>{admin.email}</td>
                                    <td style={{ direction: 'ltr', textAlign: 'right' }}>{admin.phone}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <EditButton onClick={() => onEdit(admin)} />
                                            <DeleteButton onClick={() => onDelete(admin)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="5" className={styles.noDataCell}>
                                    <div className={styles.noDataWrapper}>
                                        <span>📭 لا توجد بيانات لعرضها</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </>
    );
};

export default AdminsTable;