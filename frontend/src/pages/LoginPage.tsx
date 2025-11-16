import React, { JSX, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function LoginPage(): JSX.Element {
  const { user, setUser, setToken } = useApp();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold mb-2">Login</h1>

      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 border rounded-xl">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          className="w-full border rounded-xl px-3 py-2"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-xl"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
