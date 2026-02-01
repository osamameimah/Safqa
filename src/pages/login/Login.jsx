import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";  
import { auth, db } from "../../firebase/firebaseConfig";
import { toast, ToastContainer } from "react-toastify";
import styles from "./Login.module.css";
import LoginHeader from "../../components/Login/LoginHeader/LoginHeader";
import InputField from "../../components/Login/InputField/InputField";

import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("البريد الإلكتروني غير صحيح").required("يرجى ادخال البريد الالكتروني"),
      password: Yup.string().min(6, "كلمة السر يجب أن تكون 6 أحرف على الأقل").required("يرجى ادخال كلمة السر"),
    }),
    onSubmit: async (values) => {
      try {
         const adminsRef = collection(db, "admins");
        const q = query(adminsRef, where("email", "==", values.email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          toast.error("عذراً، هذا الحساب غير مسجل في لوحة التحكم");
          return;
        }

        const adminDoc = querySnapshot.docs[0];
        const userData = adminDoc.data();

         if (userData.password === values.password) {
          
           try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
          } catch (e) {
            console.log("Auth login skipped: standard for manually updated passwords");
          }

           localStorage.setItem("adminUser", JSON.stringify({
            uid: userData.uid || adminDoc.id,
            role: userData.role, //
            name: userData.name
          }));

          toast.success("أهلاً بك مجدداً");

           setTimeout(() => {
            if (userData.role === "super_admin") {
              navigate("/admin/admins");  
            } else {
              navigate("/admin/plans");  
            }
          }, 1500);

        } else {
          toast.error("كلمة المرور غير صحيحة");
        }

      } catch (error) {
        console.error("Login Error:", error);
        toast.error("حدث خطأ في الاتصال بالنظام");
      }
    },
  });

  return (
    <div className={styles.page}>
      <main className={styles.loginCard}>
        <LoginHeader />

        <div className={styles.toastWrapper}>
          <ToastContainer 
            position="top-center" 
            autoClose={3000} 
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={true} 
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            limit={1}  
          />
        </div>

        <form className={styles.formBody} onSubmit={formik.handleSubmit} noValidate>
          <InputField
            label="الإيميل"
            id="email"
            type="email"
            placeholder="ex osama@gmail.com"
            {...formik.getFieldProps("email")}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          <InputField
            label="كلمة السر"
            id="password"
            type="password"
            placeholder="*********"
            {...formik.getFieldProps("password")}
            error={formik.errors.password}
            touched={formik.touched.password}
          />
          <button type="submit" className={styles.submitButton}>
            تسجيل الدخول
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;