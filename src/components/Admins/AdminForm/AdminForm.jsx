import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./AdminForm.module.css";

const AdminForm = ({ selectedAdmin, onSubmit, closeModal }) => {
    
    const validationSchema = Yup.object({
        name: Yup.string().required("حقل الاسم مطلوب"),
        email: Yup.string().email("البريد غير صحيح").required("حقل البريد مطلوب"),
        phone: Yup.string()
            .matches(/^05\d{8}$/, "يجب أن يبدأ بـ 05 ويتكون من 10 أرقام")
            .required("رقم الهاتف مطلوب"),
         password: selectedAdmin 
            ? Yup.string().min(7, "كلمة السر يجب أن تكون 7 أحرف على الأقل") 
            : Yup.string().min(7, "كلمة السر يجب أن تكون 7 أحرف على الأقل").required("حقل كلمة السر مطلوب"),
    });

    const formik = useFormik({
        initialValues: {
            name: selectedAdmin?.name || "",
            email: selectedAdmin?.email || "",
            phone: selectedAdmin?.phone || "",
            password: "",  
        },
        validationSchema,
        onSubmit: (values) => {
            const finalData = { ...values };
            
             if (selectedAdmin && !values.password) {
                delete finalData.password;
            }
            
            onSubmit(finalData); 
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className={styles.formContainer} noValidate>
            <div className={styles.inputGroup}>
                <label>الاسم بالكامل</label>
                <input 
                    type="text" 
                    placeholder="أدخل الاسم"
                    {...formik.getFieldProps("name")} 
                    className={`${styles.inputField} ${formik.touched.name && formik.errors.name ? styles.inputError : ""}`}
                />
                {formik.touched.name && formik.errors.name && <span className={styles.errorMessage}>{formik.errors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
                <label>البريد الإلكتروني</label>
                <input 
                    type="email" 
                    placeholder="example@mail.com"
                    {...formik.getFieldProps("email")} 
                    className={`${styles.inputField} ${formik.touched.email && formik.errors.email ? styles.inputError : ""}`}
                />
                {formik.touched.email && formik.errors.email && <span className={styles.errorMessage}>{formik.errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
                <label>رقم الهاتف</label>
                <input 
                    type="text" 
                    placeholder="05xxxxxxxx"
                    {...formik.getFieldProps("phone")} 
                    className={`${styles.inputField} ${formik.touched.phone && formik.errors.phone ? styles.inputError : ""}`}
                />
                {formik.touched.phone && formik.errors.phone && <span className={styles.errorMessage}>{formik.errors.phone}</span>}
            </div>

            <div className={styles.inputGroup}>
                <label>
                    كلمة السر 
                    {selectedAdmin && <span style={{fontSize: '11px', color: '#666'}}> (اتركها فارغة للمحافظة على الحالية)</span>}
                </label>
                <input 
                    type="password" 
                    placeholder="********"
                    {...formik.getFieldProps("password")} 
                    className={`${styles.inputField} ${formik.touched.password && formik.errors.password ? styles.inputError : ""}`}
                />
                {formik.touched.password && formik.errors.password && <span className={styles.errorMessage}>{formik.errors.password}</span>}
            </div>

            <button type="submit" className={styles.submitBtn}>
                {selectedAdmin ? "تحديث البيانات" : "إضافة الآن"}
            </button>
        </form>
    );
};

export default AdminForm;