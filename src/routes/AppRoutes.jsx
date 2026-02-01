import { Route, Routes, Navigate } from "react-router-dom";
import Layouts from "../layouts/Layout";
import Login from "../pages/login/Login";
import Subscripe from "../pages/Subscribers/Subscribers";
import SubscribersReqests from "../pages/SubscribersRequests/SubscribersRequests";
import SupscriptionPlans from "../pages/SupscriptionPlans/SupscriptionPlans";
import Admins from "../pages/Admins/Admins";
import ProtectedRoute from "./ProtectedRoute"; 

const AppRoutes = () => {
    return (
        <Routes>
             <Route path="/login" element={<Login />} />

             <Route 
                path="/admin" 
                element={
                    <ProtectedRoute>
                        <Layouts />
                    </ProtectedRoute>
                }
            >
                 <Route index element={<Navigate to="plans" replace />} />  
                <Route path="plans" element={<SupscriptionPlans />} />
                <Route path="subscripe" element={<Subscripe />} />
                <Route path="SubscribersReqests" element={<SubscribersReqests />} />
                
                 <Route 
                    path="admins" 
                    element={
                        <ProtectedRoute roleRequired="super_admin">
                            <Admins />
                        </ProtectedRoute>
                    } 
                />
            </Route>

             <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;