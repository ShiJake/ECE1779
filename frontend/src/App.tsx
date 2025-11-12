import React, { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Shell from "./components/Shell";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LogPage from "./pages/LogPage";


export default function App(): JSX.Element {
return (
<BrowserRouter>
<AppProvider>
<Shell>
<Routes>
<Route path="/login" element={<LoginPage />} />
<Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
<Route path="/log" element={<PrivateRoute><LogPage /></PrivateRoute>} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</Shell>
</AppProvider>
</BrowserRouter>
);
}