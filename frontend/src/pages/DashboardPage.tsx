import React, { JSX, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp, Entry } from "../context/AppContext";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from "recharts";


export default function DashboardPage(): JSX.Element {
const { entries, user } = useApp();


const byDate = useMemo(() => {
const map = new Map<string, { date: string; total: number }>();
for (const e of entries) {
if (!map.has(e.date)) map.set(e.date, { date: e.date, total: 0 });
map.get(e.date)!.total += Number(e.quantity);
}
return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}, [entries]);


const byType = useMemo(() => {
const map = new Map<string, { type: string; total: number }>();
for (const e of entries) {
if (!map.has(e.type)) map.set(e.type, { type: e.type, total: 0 });
map.get(e.type)!.total += Number(e.quantity);
}
return [...map.values()].sort((a, b) => b.total - a.total);
}, [entries]);


return (
<div className="space-y-6">
<div className="flex justify-between items-end">
<div>
<h1 className="text-2xl font-semibold">Dashboard</h1>
<p className="text-slate-500">{user ? `Welcome ${user.email}` : ""}</p>
</div>
<Link to="/log" className="bg-slate-900 text-white px-4 py-2 rounded-xl">+ Add Entry</Link>
</div>


<div className="grid md:grid-cols-5 gap-6">
<div className="md:col-span-3 border rounded-xl p-4 bg-white">
<h2 className="text-sm font-semibold text-slate-600 mb-2">Total Quantity by Day</h2>
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<LineChart data={byDate}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<Legend />
<Line dataKey="total" stroke="#8884d8" />
</LineChart>
</ResponsiveContainer>
</div>
</div>
<div className="md:col-span-2 border rounded-xl p-4 bg-white">
<h2 className="text-sm font-semibold text-slate-600 mb-2">Totals by Activity</h2>
<div className="h-64">
<ResponsiveContainer width="100%" height="100%">
<BarChart data={byType} layout="vertical">
<CartesianGrid strokeDasharray="3 3" />
<XAxis type="number" />
<YAxis type="category" dataKey="type" width={120} />
<Tooltip />
<Bar dataKey="total" fill="#8884d8" radius={[6, 6, 6, 6]} />
</BarChart>
</ResponsiveContainer>
</div>
</div>
</div>
</div>
);
}