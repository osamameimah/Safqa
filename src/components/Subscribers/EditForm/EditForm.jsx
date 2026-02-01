import React, { useState } from "react";
import styles from "./EditForm.module.css";

const EditForm = ({ user, plans, onSubmit, onCancel }) => {
     const [formData, setFormData] = useState({
        name: user?.name || "",
        company: user?.company || "",
        phone: user?.phone || "",
        address: user?.address || "",  
        planId: user?.planId || "" 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
         onSubmit(formData);
    };

    return (
        <form className={styles.formGrid} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label>الاسم بالكامل</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label>اسم الشركة</label>
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.inputGroup}>
                <label>رقم الهاتف</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.inputGroup}>
                <label>العنوان</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="مثال: الرياض، حي الملز" />
            </div>

            <div className={styles.inputGroup}>
                <label>نوع الباقة</label>
                <select name="planId" value={formData.planId} onChange={handleChange}>
                    <option value="">لا توجد باقة (مستخدم جديد)</option>
                    {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn}>
                    تحديث البيانات
                </button>
        
            </div>
        </form>
    );
};

export default EditForm;