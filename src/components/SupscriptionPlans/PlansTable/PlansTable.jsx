import React, { useState } from "react";
import Styles from "./PlansTable.module.css";
import Pagination from "../../Pagination/Pagination";
import EditButton from "../../CustomButton/EditButton/EditButton";
import DeleteButton from "../../CustomButton/DeleteButton/DeleteButton";

const PlansTable = ({ plansData = [], onEdit, onDelete, currentPage, totalPages, onPageChange }) => {
    return (
        <>
            <div className={Styles.tableContainer}>
                <table className={Styles.customTable}>
                    <thead>
                        <tr>
                            <th>تفاصيل الباقة</th>
                            <th>مميزات</th>
                            <th>التكلفة والمدة</th>
                            <th>الحدود التقنية</th>
                            <th>الصلاحيات</th>
                            <th>الإحصائيات</th>
                            <th>المطابقات</th>
                            <th>الحالة</th>
                            <th style={{ textAlign: 'center' }}>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                         {plansData.length > 0 ? (
                            plansData.map((plan) => (
                                <tr key={plan.id}>
                                    <td>
                                        <div className={Styles.planPrimaryInfo}>
                                            <span className={Styles.planNameText}>{plan.name}</span>
                                            <p className={Styles.planDescriptionTruncated} title={plan.description}>
                                                {plan.description}
                                            </p>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={Styles.descriptionWrapper}>
                                            <ul className={Styles.descriptionList}>
                                                {Array.isArray(plan.features) ? (
                                                    plan.features.map((f, i) => (
                                                        <li key={i} className={Styles.featureItem}>{f}</li>
                                                    ))
                                                ) : typeof plan.features === 'object' && plan.features !== null ? (
                                                    Object.values(plan.features).map((f, i) => (
                                                        <li key={i} className={Styles.featureItem}>{String(f)}</li>
                                                    ))
                                                ) : (
                                                    <li className={Styles.featureItem}>لا توجد مميزات</li>
                                                )}
                                            </ul>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={Styles.priceWrapper}>
                                            <span className={Styles.priceAmount}>{plan.price === 0 ? "مجانية" : `${plan.price}$`}</span>
                                            <span className={Styles.durationLabel}>/ {plan.durationDays} يوم</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={Styles.limitsInfo}>
                                            <div>📄 {plan.maxInvoices === -1 ? "∞" : plan.maxInvoices} فاتورة</div>
                                            <div>👥 {plan.maxAccounts === -1 ? "∞" : plan.maxAccounts} حسابات</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={Styles.permissionsWrapper}>
                                            <span className={plan.hasReports ? Styles.permYes : Styles.permNo}>{plan.hasReports ? "✓ تقارير" : "✕ تقارير"}</span>
                                            <span className={plan.hasMatching ? Styles.permYes : Styles.permNo}>{plan.hasMatching ? "✓ مطابقة" : "✕ مطابقة"}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={Styles.statsBadge}>
                                            <span className={Styles.countNumber}>{plan.subscriberCount || 0}</span>
                                            <span className={Styles.statLabel}>مشترك</span>
                                           
                                        </div>
                                    </td>
                                    <td>
                                        <div className={Styles.statsBadge}>
                                            <span>{plan.maxMatchings === -1 ? "∞" :plan.maxMatchings}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={plan.isActive ? Styles.badgeActive : Styles.badgeExpired}>
                                            {plan.isActive ? "نشطة" : "متوقفة"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={Styles.actionButtons}>
                                            <EditButton onClick={() => onEdit(plan)} />
                                            <DeleteButton onClick={() => onDelete(plan)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan="5" className={Styles.noDataCell}>
                                    <div className={Styles.noDataWrapper}>
                                        <span>📭 لا توجد بيانات لعرضها</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {plansData.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </>
    );
};

export default PlansTable;