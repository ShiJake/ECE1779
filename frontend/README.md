# 🏋️‍♂️ FitLog Frontend

A simple fitness logging web application built with **React + TypeScript + Vite + TailwindCSS**.  
It allows users to log fitness activities, view their progress charts, and manage their data locally (or via API when backend is connected).

---

## 🚀 Getting Started

### 1. Install dependencies
Make sure you have **Node.js ≥ 18** installed.

```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Then open the printed local URL, usually:  
👉 [http://localhost:5173](http://localhost:5173)

---

## 🧱 Project Structure
```
SweatSync/
├── src/
│   ├── pages/           # Login, Dashboard, Log pages
│   ├── components/      # Reusable UI components
│   ├── context/         # App-wide state (user, entries)
│   ├── index.css        # Tailwind base styles
│   ├── main.tsx         # App entry point
│   └── App.tsx          # Router & page composition
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 🧩 Scripts
| Command | Description |
|----------|--------------|
| `npm run dev` | Start local dev server |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |

---

## ⚙️ Environment
If you later connect a backend API, you can define your base URL in a `.env` file:
```
VITE_API_BASE_URL=https://api.yourserver.com
```

Access it in code via:
```ts
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 🧠 Notes
- Styling uses **TailwindCSS v4**.
- Charts use **Recharts**.
- Until backend integration, fitness entries are saved in **localStorage**.
- See [`docs/api-spec.md`](./docs/api-spec.md) for API interface details.
