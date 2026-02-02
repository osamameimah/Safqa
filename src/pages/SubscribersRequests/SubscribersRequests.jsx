import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    collection,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    getDoc
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import RequestsTable from "../../components/SubscribersRequests/RequestsTable/RequestsTable";
import DetailsView from "../../components/SubscribersRequests/DetailsView/DetailsView";
import ApproveAction from "../../components/SubscribersRequests/ApproveAction/ApproveAction";
import DeleteAction from "../../components/SubscribersRequests/DeleteAction/DeleteAction";
import Search from "../../components/Search/Search";
import styles from "./SubscribersRequests.module.css";

const SubscribersRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) closeModal();
        };
        if (activeModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeModal]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "user_subscriptions"), async (snapshot) => {
            const allData = await Promise.all(snapshot.docs.map(async (subscriptionDoc) => {
                const subData = subscriptionDoc.data();

                let userData = { name: "مستخدم غير معروف", email: "لا يوجد بريد", companyName: "بدون شركة" };
                if (subData.userId) {
                    const userDoc = await getDoc(doc(db, "users", subData.userId));
                    if (userDoc.exists()) userData = userDoc.data();
                }

                let planData = { name: "باقة غير معروفة" };
                if (subData.planId) {
                    const planDoc = await getDoc(doc(db, "subscription_plans", subData.planId));
                    if (planDoc.exists()) planData = planDoc.data();
                }

                return {
                    id: subscriptionDoc.id,
                    ...subData,
                    name: userData.name || "مستخدم مجهول",
                    email: userData.email || "---",
                    phone: userData.phone || "---",
                    companyName: userData.companyName || "---",
                    address: userData.address || "غير محدد",
                    planName: planData.name || "باقة مجهولة",
                };
            }));

            setRequests(allData);
            setFilteredData(allData);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        const results = requests.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
    }, [searchTerm, requests]);

     const handleUpdateStatus = async (id, newStatus) => {
        try {
            const subRef = doc(db, "user_subscriptions", id);
            const updateData = {
                status: newStatus,
                updatedAt: new Date().toISOString(),
                approvedBy: "Super Admin" 
            };

            await updateDoc(subRef, updateData);
            toast.success("تم تحديث حالة الاشتراك بنجاح");
            closeModal();
        } catch (error) {
            toast.error("حدث خطأ أثناء تحديث الحالة");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "user_subscriptions", id));
            toast.error("تم حذف الطلب بنجاح");
            closeModal();
        } catch (error) {
            toast.error("خطأ في الحذف");
        }
    };

    const openModal = (type, data) => {
        setSelectedUser(data);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedUser(null);
    };

    return (
        <div className={styles.container}>
            <ToastContainer position="top-left" autoClose={2000} rtl={true} />
            <Breadcrumb contant="طلبات الاشتراك" />

            <div className={styles.headerSection}>
                <Search
                    content="إبحث عن اسم المشترك أو الشركة..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>جاري التحميل...</p>
            ) : (
                <RequestsTable data={filteredData} onOpenModal={openModal} />
            )}

            {activeModal && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalCard} ${activeModal === 'details' ? styles.wideModal : ''}`} ref={modalRef}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {activeModal === 'details' ? "تفاصيل المشترك" :
                                    activeModal === 'status' ? "تعديل حالة الاشتراك" : "حذف السجل"}
                            </h2>
                            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
                        </div>
                        <div className={styles.modalContent}>
                            {activeModal === 'details' && <DetailsView user={selectedUser} />}
                            
                            {activeModal === 'status' && (
                                <ApproveAction
                                    user={selectedUser}
                                    onConfirm={(status) => handleUpdateStatus(selectedUser.id, status)}
                                    onCancel={closeModal}
                                />
                            )}

                            {activeModal === 'delete' && (
                                <DeleteAction
                                    adminName={selectedUser?.name}
                                    onDelete={() => handleDelete(selectedUser.id)}
                                    closeModal={closeModal}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscribersRequests;