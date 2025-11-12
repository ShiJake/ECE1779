import React, { JSX, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";


function todayISO(): string {
const d = new Date();
return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}


export default function LogPage(): JSX.Element {
const { addEntry } = useApp();
const navigate = useNavigate();
const [date, setDate] = useState<string>(todayISO());
const [type, setType] = useState<string>("Run (min)");
const [quantity, setQuantity] = useState<string>("");


const submit = (e: React.FormEvent) => {
e.preventDefault();
const q = Number(quantity);
if (!q || q <= 0) return alert("Enter a valid number");
addEntry({ date, type, quantity: q });
navigate("/");
};


return (
<div className="mx-auto max-w-lg">
<h1 className="text-2xl font-semibold mb-4">Log Activity</h1>
<form onSubmit={submit} className="space-y-4 bg-white border p-6 rounded-xl">
<div className="grid md:grid-cols-2 gap-4">
<div>
<label>Date</label>
<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded-xl px-3 py-2" />
</div>
<div>
<label>Activity Type</label>
<select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded-xl px-3 py-2">
<option>Run (min)</option>
<option>Cycling (min)</option>
<option>Swim (min)</option>
<option>Push-ups (reps)</option>
<option>Squats (reps)</option>
<option>Plank (sec)</option>
</select>
</div>
</div>
<div>
<label>Quantity</label>
<input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g., 30" className="w-full border rounded-xl px-3 py-2" />
</div>
<div className="flex gap-3">
<button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-xl">Save</button>
<Link to="/" className="border px-4 py-2 rounded-xl">Cancel</Link>
</div>
</form>
</div>
);
}