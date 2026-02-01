import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "./PlanForm.module.css";

const PlanForm = ({ selectedPlan, onSubmit, closeModal }) => {
    const [featureInput, setFeatureInput] = useState("");

     const ensureArray = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        return Object.values(data);  
    };

    const formik = useFormik({
        enableReinitialize: true, 
        initialValues: {
            name: selectedPlan?.name || "",
            description: selectedPlan?.description || "",
            price: selectedPlan?.price || 0,
            durationDays: selectedPlan?.durationDays || 30,
            features: ensureArray(selectedPlan?.features),
            invoicesType: selectedPlan?.maxInvoices === -1 ? "unlimited" : "limited",
            maxInvoices: selectedPlan?.maxInvoices === -1 ? "" : (selectedPlan?.maxInvoices || ""),
            accountsType: selectedPlan?.maxAccounts === -1 ? "unlimited" : "limited",
            maxAccounts: selectedPlan?.maxAccounts === -1 ? "" : (selectedPlan?.maxAccounts || ""),
            matchingsType: selectedPlan?.maxMatchings === -1 ? "unlimited" : "limited",
            maxMatchings: selectedPlan?.maxMatchings === -1 ? "" : (selectedPlan?.maxMatchings || ""),
            hasMatching: selectedPlan?.hasMatching ?? true,
            hasReports: selectedPlan?.hasReports ?? true,
            isActive: selectedPlan?.isActive ?? true,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("حقل الاسم مطلوب"),
            price: Yup.number().min(0, "السعر لا يمكن أن يكون سالباً").required("مطلوب"),
            durationDays: Yup.number().min(1, "المدة يجب أن تكون يوماً واحداً على الأقل").required("مطلوب"),
        }),
 onSubmit: (values) => {
    const finalData = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        durationDays: Number(values.durationDays),  
        features: values.features,
         maxInvoices: values.invoicesType === "unlimited" ? -1 : Number(values.maxInvoices),
        maxAccounts: values.accountsType === "unlimited" ? -1 : Number(values.maxAccounts),
        maxMatchings: values.matchingsType === "unlimited" ? -1 : Number(values.maxMatchings),
        hasMatching: values.hasMatching,
        hasReports: values.hasReports,
        isActive: values.isActive,
    };
    onSubmit(finalData); 
}
    });

    const addFeature = () => {
        if (featureInput.trim()) {
            formik.setFieldValue("features", [...formik.values.features, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const removeFeature = (index) => {
        const newFeats = formik.values.features.filter((_, i) => i !== index);
        formik.setFieldValue("features", newFeats);
    };

    const renderLimitField = (label, typeKey, valueKey) => (
        <div className={styles.inputGroup}>
            <label>{label}</label>
            <div className={styles.limitControl}>
                <select {...formik.getFieldProps(typeKey)} className={styles.selectType}>
                    <option value="limited">محدود</option>
                    <option value="unlimited">غير محدود</option>
                </select>
                {formik.values[typeKey] === "limited" && (
                    <input type="number" {...formik.getFieldProps(valueKey)} placeholder="العدد" className={styles.numInput} />
                )}
            </div>
        </div>
    );

    return (
        <form onSubmit={formik.handleSubmit} className={styles.formGrid} noValidate>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>اسم الباقة</label>
                <input type="text" {...formik.getFieldProps("name")} placeholder="الباقة الاحترافية" />
                {formik.errors.name && formik.touched.name && <span className={styles.error}>{formik.errors.name}</span>}
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>وصف مختصر</label>
                <input type="text" {...formik.getFieldProps("description")} placeholder="وصف مختصر"/>
            </div>

            <div className={styles.inputGroup}>
                <label>السعر ($)</label>
                <input type="number" {...formik.getFieldProps("price")} />
            </div>

            <div className={styles.inputGroup}>
                <label>المدة (أيام)</label>
                <input type="number" {...formik.getFieldProps("durationDays")} />
            </div>

            {renderLimitField("أقصى عدد فواتير", "invoicesType", "maxInvoices")}
            {renderLimitField("أقصى عدد حسابات", "accountsType", "maxAccounts")}
            {renderLimitField("أقصى عدد مطابقات", "matchingsType", "maxMatchings")}

            <div className={styles.featuresSection}>
                <label>المميزات</label>
                <div className={styles.featureInputRow}>
                    <input 
                        value={featureInput} 
                        onChange={(e) => setFeatureInput(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        placeholder="أضف ميزة..." 
                    />
                    <button type="button" onClick={addFeature}>أضف</button>
                </div>

                <div className={styles.featuresTags}>
                    {formik.values.features.map((f, i) => (
                        <span key={i} className={styles.tag}>
                            {f} <b onClick={() => removeFeature(i)} style={{cursor: 'pointer'}}>&times;</b>
                        </span>
                    ))}
                </div>
            </div>

            <div className={styles.checkboxSection}>
                <span className={styles.sectionTitle}>الصلاحيات والحالة</span>
                <div className={styles.checkboxGrid}>
                    <label className={styles.checkLabel}>
                        <input type="checkbox" name="hasMatching" checked={formik.values.hasMatching} onChange={formik.handleChange} /> 
                        تفعيل المطابقة
                    </label>
                    <label className={styles.checkLabel}>
                        <input type="checkbox" name="hasReports" checked={formik.values.hasReports} onChange={formik.handleChange} /> 
                        تفعيل التقارير
                    </label>
                    <label className={styles.checkLabel}>
                        <input type="checkbox" name="isActive" checked={formik.values.isActive} onChange={formik.handleChange} /> 
                        الباقة نشطة
                    </label>
                </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
                {selectedPlan ? "حفظ التغييرات" : "إضافة الباقة الآن"}
            </button>
        </form>
    );
};

export default PlanForm;