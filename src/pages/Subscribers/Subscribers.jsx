import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import SubscribersTable from "../../components/Subscribers/SubscribersTable/SubscribersTable";
import DetailsView from "../../components/Subscribers/DetailsView/DetailsView";
import EditForm from "../../components/Subscribers/EditForm/EditForm";
import DeleteDialog from "../../components/Subscribers/DeleteDialog/DeleteDialog";
import Search from "../../components/Search/Search";
import styles from "./Subscribers.module.css";

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [allPlans, setAllPlans] = useState([]);
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) closeModal();
        };
        if (activeModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeModal]);

    // جلب الباقات
    useEffect(() => {
        const unsubPlans = onSnapshot(collection(db, "subscription_plans"), (snapshot) => {
            const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAllPlans(plans);
        });
        return () => unsubPlans();
    }, []);

    // جلب المستخدمين مع اشتراكاتهم
    useEffect(() => {
        const unsubUsers = onSnapshot(collection(db, "users"), async (userSnapshot) => {
            const usersData = await Promise.all(userSnapshot.docs.map(async (userDoc) => {
                const userData = userDoc.data();
                const userId = userDoc.id;

                const subQuery = query(collection(db, "user_subscriptions"), where("userId", "==", userId));
                const subSnapshot = await getDocs(subQuery);
                
                let subscription = null;
                if (!subSnapshot.empty) {
                    subscription = { id: subSnapshot.docs[0].id, ...subSnapshot.docs[0].data() };
                }

                const userPlan = allPlans.find(p => p.id === subscription?.planId);

                return {
                    id: userId,
                    userId: userId,
                    subscriptionId: subscription?.id || null,
                    name: userData.name || "مستخدم جديد",
                    company: userData.companyName || "---",
                    photoUrl: userData.photoUrl || null,
                    email: userData.email || "",
                    phone: userData.phone || "---",
                    address: userData.address || "غير محدد",
                    plan: userPlan?.name || "لا يوجد اشتراك",
                    planId: subscription?.planId || "",
                    endDate: subscription?.endDate || "---",
                    // تمرير الحالة كما هي من Firebase (active, pending, etc.)
                    status: subscription?.status || "none" 
                };
            }));

            setSubscribers(usersData);
            setFilteredData(usersData);
            setLoading(false);
        });

        return () => unsubUsers();
    }, [allPlans]);

    useEffect(() => {
        const results = subscribers.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.company.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(results);
    }, [searchTerm, subscribers]);

    const openModal = (type, user) => {
        setSelectedUser(user);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedUser(null);
    };

    const handleUpdate = async (updatedData) => {
        try {
            const userRef = doc(db, "users", selectedUser.userId);
            await updateDoc(userRef, {
                name: updatedData.name,
                companyName: updatedData.company,
                phone: updatedData.phone,
                address: updatedData.address  
            });

            if (selectedUser.subscriptionId) {
                const subRef = doc(db, "user_subscriptions", selectedUser.subscriptionId);
                await updateDoc(subRef, { 
                    planId: updatedData.planId,
                    status: updatedData.status // تحديث الحالة أيضاً إذا كان متاحاً في الفورم
                });
            }

            toast.success("تم تحديث بيانات المستخدم بنجاح");
            closeModal();
        } catch (error) {
            console.error(error);
            toast.error("فشل التحديث");
        }
    };

    const handleDelete = async () => {
        try {
            const targetId = selectedUser.userId;
            await deleteDoc(doc(db, "users", targetId));
            if (selectedUser.subscriptionId) {
                await deleteDoc(doc(db, "user_subscriptions", selectedUser.subscriptionId));
            }
            toast.error("تم حذف المستخدم وكافة بياناته");
            closeModal();
        } catch (error) {
            toast.error("فشل في الحذف");
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer position="top-left" autoClose={2000} rtl={true} />
            <Breadcrumb contant="المستخدمين" />
            <div className={styles.headerSection}>
                <Search content="إبحث عن اسم أو شركة..." onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {loading ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>جاري التحميل...</p>
            ) : (
                <SubscribersTable data={filteredData} onOpenModal={openModal} />
            )}
            {activeModal && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalCard} ${activeModal === 'details' ? styles.wideModal : ''}`} ref={modalRef}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {activeModal === 'details' && "ملف المستخدم"}
                                {activeModal === 'edit' && "تعديل المستخدم"}
                                {activeModal === 'delete' && "تأكيد الحذف"}
                            </h2>
                            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
                        </div>
                        <div className={styles.modalContent}>
                            {activeModal === 'details' && <DetailsView user={selectedUser} onEdit={() => openModal('edit', selectedUser)} />}
                            {activeModal === 'edit' && <EditForm user={selectedUser} onSubmit={handleUpdate} onCancel={closeModal} plans={allPlans} />}
                            {activeModal === 'delete' && <DeleteDialog adminName={selectedUser?.name} onDelete={handleDelete} closeModal={closeModal} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscribers;