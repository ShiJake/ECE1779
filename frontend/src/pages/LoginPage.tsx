import React, { JSX, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";


export default function LoginPage(): JSX.Element {
const { user, setUser } = useApp();
const [email, setEmail] = useState("");
const navigate = useNavigate();


const onSubmit = (e: React.FormEvent) => {
e.preventDefault();
setUser({ email });
navigate("/");
};


if (user) return <Navigate to="/" replace />;


return (
<div className="mx-auto max-w-md">
<h1 className="text-2xl font-semibold mb-2">Login</h1>
<form onSubmit={onSubmit} className="space-y-4 bg-white p-6 border rounded-xl">
<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full border rounded-xl px-3 py-2" />
<button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-xl">Continue</button>
</form>
</div>
);
}