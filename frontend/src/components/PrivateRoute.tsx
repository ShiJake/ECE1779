import React, { JSX, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";


export default function PrivateRoute({ children }: { children: ReactElement }): JSX.Element {
const { user } = useApp();
return user ? children : <Navigate to="/login" replace />;
}