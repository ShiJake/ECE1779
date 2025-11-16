import React, { JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Shell from "./components/Shell";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import LogPage from "./pages/LogPage";
import SignupPage from "./pages/SignupPage";

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppProvider>
        <Shell>
          <Routes>

            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Private routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/log"
              element={
                <PrivateRoute>
                  <LogPage />
                </PrivateRoute>
              }
            />

            {/* Wildcard must be last */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </AppProvider>
    </BrowserRouter>
  );
}
