import React, { JSX, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function SignupPage(): JSX.Element {
  const { user, setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || window.location.origin; // fallback for local
  console.log("VITE_API_BASE =", import.meta.env.VITE_API_BASE);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Account created successfully! Please log in.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Signup failed, check the console.");
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold mb-2">Sign Up</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white p-6 border rounded-xl"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full border rounded-xl px-3 py-2"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-full border rounded-xl px-3 py-2"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm password"
          className="w-full border rounded-xl px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-xl"
        >
          Create Account
        </button>

        <p className="text-sm text-center text-slate-500">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
