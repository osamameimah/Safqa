import React, { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { db, auth } from "../../firebase/firebaseConfig"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import AdminForm from "../../components/Admins/AdminForm/AdminForm";
import DeleteModal from "../../components/Admins/DeleteModal/DeleteModal";
import AdminsTable from "../../components/Admins/AdminsTable/AdminsTable";
import Search from "../../components/Search/Search";
import AddButton from "../../components/CustomButton/AddButton/AddButton";
import styles from "./Admins.module.css";
import { updatePassword } from "firebase/auth";

 
const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const adminsPerPage = 4;
    const modalRef = useRef();



     const currentUser = JSON.parse(localStorage.getItem("adminUser"));
    const isSuperAdmin = currentUser?.role === "super_admin";



        useEffect(() => {
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target)) closeModal();
            };
            if (activeModal) document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, [activeModal]);
        
    useEffect(() => {
        if (!isSuperAdmin) {
             window.location.href = "/admin/plans";
        }
    }, [isSuperAdmin]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "admins"), (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
             setAdmins(data.filter(a => a.role !== "super_admin"));
        });
        return () => unsubscribe();
    }, []);

    const filteredAdmins = admins.filter(admin => 
        admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage) || 1;
    const currentAdmins = filteredAdmins.slice((currentPage - 1) * adminsPerPage, currentPage * adminsPerPage);

    const openModal = (type, admin = null) => {
        setSelectedAdmin(admin);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedAdmin(null);
    };

const handleAddOrUpdate = async (values) => {
    try {
        if (selectedAdmin) {
            // حالة التعديل
            const adminRef = doc(db, "admins", selectedAdmin.id);
            const updateData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
            };

            // إذا أدخل الـ Super Admin كلمة سر جديدة، نقوم بتحديثها في Firestore
            if (values.password && values.password.trim() !== "") {
                updateData.password = values.password;
                
                /* ملاحظة فنية: تغيير الباسورد في Firebase Auth يتطلب تسجيل دخول المستخدم نفسه.
                  لذلك سنقوم بتحديثها في الـ Firestore لكي يتمكن المدير من رؤيتها 
                  أو لكي يستخدمها النظام في عمليات التحقق الخاصة بك.
                */
            }

            await updateDoc(adminRef, updateData);
            toast.success("تم تحديث بيانات المدير بنجاح");
            
        } else {
            // حالة إضافة مدير جديد (تعمل بشكل صحيح في كودك)
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            await setDoc(doc(db, "admins", user.uid), {
                name: values.name,
                email: values.email,
                phone: values.phone,
                uid: user.uid,
                password: values.password, // تخزينها للدخول مستقبلاً
                role: "admin",  
                createdAt: serverTimestamp()
            });
            toast.success("تم إضافة المدير الجديد بنجاح");
        }
        closeModal();
    } catch (error) {
        console.error(error);
        if (error.code === "auth/email-already-in-use") {
            toast.error("هذا البريد الإلكتروني مستخدم بالفعل");
        } else {
            toast.error("حدث خطأ في النظام");
        }
    }
};

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "admins", selectedAdmin.id));
            toast.error(`تم حذف المدير`);
            closeModal();
        } catch (error) {
            toast.error("فشل الحذف");
        }
    };

    if (!isSuperAdmin) return null;  

    return (
        <div className={styles.container}>
            <ToastContainer position="top-left" autoClose={3000} rtl={true} />
            <Breadcrumb contant="المدراء" />
            <div className={styles.headerSection}>
                <AddButton text="إضافة مدير جديد" onClick={() => openModal('form')} />
                <Search content="إبحث عن مدير. ." onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }} />
            </div>
            <AdminsTable
                admins={currentAdmins}
                onEdit={(admin) => openModal('form', admin)}
                onDelete={(admin) => openModal('delete', admin)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
            {activeModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard} ref={modalRef}>
                        <div className={styles.modalHeader}>
                            <h2>{activeModal === 'delete' ? "تأكيد الحذف" : (selectedAdmin ? "تعديل بيانات المدير" : "إضافة مدير جديد")}</h2>
                            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
                        </div>
                        <div className={styles.modalContent}>
                            {activeModal === 'form' ? (
                                <AdminForm selectedAdmin={selectedAdmin} onSubmit={handleAddOrUpdate} closeModal={closeModal} />
                            ) : (
                                <DeleteModal adminName={selectedAdmin?.name} onDelete={handleDelete} closeModal={closeModal} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admins;