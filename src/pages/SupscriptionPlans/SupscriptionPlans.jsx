import React, { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import PlanForm from "../../components/SupscriptionPlans/PlanForm/PlanForm";
import DeletePlanModal from "../../components/SupscriptionPlans/DeletePlanModal/DeletePlanModal";
import PlansTable from "../../components/SupscriptionPlans/PlansTable/PlansTable";
import Styles from "./SupscriptionPlans.module.css";
import Search from "../../components/Search/Search";
import AddButton from "../../components/CustomButton/AddButton/AddButton";

const SupscriptionPlans = () => {
    const [plansData, setPlansData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const plansPerPage = 4;
    const modalRef = useRef();

     useEffect(() => {
         const unsubSubs = onSnapshot(collection(db, "user_subscriptions"), (subsSnapshot) => {
            const allSubscriptions = subsSnapshot.docs.map(doc => ({
                planId: doc.data().planId,
                status: doc.data().status
            }));

             const unsubPlans = onSnapshot(collection(db, "subscription_plans"), (plansSnapshot) => {
                const plans = plansSnapshot.docs.map(docPlan => {
                    const planId = docPlan.id;
                     const count = allSubscriptions.filter(sub =>
                        sub.planId === planId && sub.status === "active"
                    ).length;

                    return {
                        id: planId,
                        ...docPlan.data(),
                        subscriberCount: count 
                    };
                });
                setPlansData(plans);
            });

            return () => unsubPlans();
        });

        return () => unsubSubs();
    }, []);

     useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) closeModal();
        };
        if (activeModal) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [activeModal]);

     const filteredPlans = plansData.filter(plan =>
        plan.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPlans.length / plansPerPage) || 1;
    const currentPlans = filteredPlans.slice((currentPage - 1) * plansPerPage, currentPage * plansPerPage);

     const openModal = (type, plan = null) => {
        setSelectedPlan(plan);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedPlan(null);
    };

     const handleAddOrUpdate = async (values) => {
        try {
            if (selectedPlan) {
                 const planRef = doc(db, "subscription_plans", selectedPlan.id);
                await updateDoc(planRef, values);
                toast.success("تم تحديث الباقة بنجاح");
            } else {
                 await addDoc(collection(db, "subscription_plans"), values);
                toast.success("تم إضافة الباقة بنجاح");
            }
            closeModal();  
        } catch (error) {
            console.error("Firebase Error:", error);
            toast.error("حدث خطأ في العملية، تأكد من البيانات");
        }
    };

     const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "subscription_plans", selectedPlan.id));
            toast.error("تم حذف الباقة بنجاح");
            closeModal();
        } catch (error) {
            toast.error("فشل الحذف");
        }
    };

    return (
        <div className={Styles.container}>
            <ToastContainer position="top-left" autoClose={3000} rtl={true} />
            <Breadcrumb contant="باقات الاشتراك" />

            <div className={Styles.headerSection}>
                <AddButton text="إضافة باقة جديدة" onClick={() => openModal('form')} />
                <Search content="إبحث عن باقة. ." onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                }} />
            </div>

            <PlansTable
                plansData={currentPlans}
                onEdit={(plan) => openModal('form', plan)}
                onDelete={(plan) => openModal('delete', plan)}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {activeModal && (
                <div className={Styles.modalOverlay}>
                    <div className={Styles.modalCard} ref={modalRef}>
                        <div className={Styles.modalHeader}>
                            <h2>
                                {activeModal === 'delete' 
                                    ? "تأكيد الحذف" 
                                    : selectedPlan ? "تعديل بيانات الباقة" : "إضافة باقة جديدة"}
                            </h2>
                            <button className={Styles.closeBtn} onClick={closeModal}>&times;</button>
                        </div>
                        <div className={Styles.modalContent}>
                            {activeModal === 'form' ? (
                                <PlanForm 
                                    selectedPlan={selectedPlan} 
                                    onSubmit={handleAddOrUpdate} 
                                    closeModal={closeModal} 
                                />
                            ) : (
                                <DeletePlanModal 
                                    planName={selectedPlan?.name} 
                                    onDelete={handleDelete} 
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

export default SupscriptionPlans;