import React, { JSX, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";


export default function Shell({ children }: { children: ReactNode }): JSX.Element {
const { user, setUser } = useApp();
const navigate = useNavigate();


const logout = () => {
setUser(null);
navigate("/login");
};


return (
<div className="min-h-screen bg-slate-50 text-slate-800">
<header className="sticky top-0 border-b bg-white/80 backdrop-blur">
<div className="mx-auto max-w-6xl px-4 py-3 flex justify-between items-center">
<div className="flex items-center gap-2">
<div className="h-6 w-6 rounded bg-indigo-600" />
<Link to="/" className="font-semibold">FitLog</Link>
</div>
<nav className="flex gap-3 text-sm">
<Link to="/" className="hover:underline">Dashboard</Link>
<Link to="/log" className="hover:underline">Log</Link>
{user ? (
<button onClick={logout} className="rounded border px-3 py-1 hover:bg-slate-100">Logout</button>
) : (
<Link to="/login" className="rounded border px-3 py-1 hover:bg-slate-100">Login</Link>
)}
</nav>
</div>
</header>
<main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
</div>
);
}