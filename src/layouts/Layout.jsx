import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';
import Logo from "../assets/Fawateer.jpg";
import { auth } from "../firebase/firebaseConfig";

const Layouts = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

     const getAdminData = () => {
        const data = localStorage.getItem("adminUser");
        try {
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Error parsing admin data:", e);
            return null;
        }
    };

    const user = getAdminData();
    const isSuperAdmin = user?.role === "super_admin";

     const handleLogout = async () => {
        try {
            await auth.signOut();  
            localStorage.removeItem("adminUser"); 
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
             localStorage.removeItem("adminUser");
            navigate('/login');
        }
    };

    return (
        <div className={styles.adminLayout}>
             <button className={styles.menuBtn} onClick={() => setOpen(!open)}> ☰ </button>

            <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <img src={Logo} alt="Logo" className={styles.adminLogo} />
                    <h2 className={styles.adminTitle}>صفقة</h2>
                </div>

                <nav className={styles.navMenu} onClick={() => setOpen(false)}>
                     <NavLink to="plans" className={({ isActive }) => isActive ? styles.active : ''}>
                        <span className={styles.icon}>📊</span>
                        <span className={styles.linkText}>الباقات</span>
                    </NavLink>

                    <NavLink to="SubscribersReqests" className={({ isActive }) => isActive ? styles.active : ''}>
                        <span className={styles.icon}>📩</span>
                        <span className={styles.linkText}>طلبات الاشتراك</span>
                    </NavLink>

                    <NavLink to="subscripe" className={({ isActive }) => isActive ? styles.active : ''}>
                        <span className={styles.icon}>👥</span>
                        <span className={styles.linkText}>المشتركين</span>
                    </NavLink>

                     {isSuperAdmin && (
                        <NavLink to="admins" className={({ isActive }) => isActive ? styles.active : ''}>
                            <span className={styles.icon}>👨‍💼</span>
                            <span className={styles.linkText}>المدراء</span>
                        </NavLink>
                    )}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        تسجيل خروج
                    </button>
                </div>
            </aside>

             <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layouts;