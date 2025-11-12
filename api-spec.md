# FitLog API Specification

_Last updated: 2025-11-11 • Version 0.1 (frontend contract)_

**Base URL:** `https://<backend-host>/api`  
**Auth:** Bearer JWT (except `/auth/login`)  
**Headers:**  
```
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

## Error Envelope
All non-2xx responses return:
```json
{
  "error": {
    "code": "string",
    "message": "Human readable description",
    "details": { "field?": "reason" }
  }
}
```

---

## 1) Authentication

### POST `/auth/login`
Logs in a user by email and returns an auth token.

**Request**
```json
{ "email": "you@example.com" }
```

**Responses**
- `200 OK`
```json
{
  "token": "jwt-string",
  "user": { "id": 12, "email": "you@example.com" }
}
```
- `400 Bad Request` • `401 Unauthorized`

---

## 2) Current User

### GET `/me`
Fetch the current logged-in user (used to restore session).

**Headers:** `Authorization: Bearer <token>`  
**Response `200`**
```json
{ "id": 12, "email": "you@example.com" }
```
- `401` invalid/missing token

---

## 3) Activities (catalog)

### GET `/activities`
List allowed activity types for the logging form.

**Response `200`**
```json
[
  "Run (min)",
  "Cycling (min)",
  "Swim (min)",
  "Row (min)",
  "Push-ups (reps)",
  "Pull-ups (reps)",
  "Squats (reps)",
  "Plank (sec)"
]
```

---

## 4) Fitness Entries

### GET `/entries`
Fetch the user’s entries (dashboard uses this to render charts).

**Query (optional)**
- `from` — ISO date `YYYY-MM-DD`
- `to` — ISO date `YYYY-MM-DD`
- `type` — activity filter (exact match)

**Response `200`**
```json
[
  { "id": 1, "date": "2025-11-09", "type": "Run (min)", "quantity": 30 },
  { "id": 2, "date": "2025-11-10", "type": "Push-ups (reps)", "quantity": 50 }
]
```

---

### POST `/entries`
Create a new entry (log page submit).

**Request**
```json
{ "date": "2025-11-12", "type": "Squats (reps)", "quantity": 60 }
```

**Responses**
- `201 Created`
```json
{
  "id": 101,
  "date": "2025-11-12",
  "type": "Squats (reps)",
  "quantity": 60
}
```
- `422 Unprocessable Entity` (validation errors)

---

### PUT `/entries/{id}`  _(optional – not used by UI yet)_
Update an existing entry.

**Request**
```json
{ "date": "2025-11-12", "type": "Run (min)", "quantity": 25 }
```

**Response `200`**
```json
{ "id": 101, "date": "2025-11-12", "type": "Run (min)", "quantity": 25 }
```

---

### DELETE `/entries/{id}`  _(optional – not used by UI yet)_
Delete an entry.

**Response `204 No Content`**

---

## Data Contracts

```ts
// Entry shown in charts/tables
type Entry = {
  id: number;        // server-generated
  date: string;      // ISO date YYYY-MM-DD
  type: string;      // one of /activities
  quantity: number;  // > 0
};

// Minimal user info kept client-side
type User = {
  id: number;
  email: string;
};
```

---

## UI → API Mapping

- **Login page** → `POST /auth/login` → store token → optional `GET /me`
- **Dashboard page** → `GET /entries` (with optional `from`/`to`/`type`), aggregate client-side
- **Log page** → `GET /activities` (dropdown) → `POST /entries` (submit)

---

## Example cURL

```bash
# Login
curl -sX POST https://<host>/api/auth/login   -H 'Content-Type: application/json'   -d '{"email":"you@example.com"}'

# Get entries last 7 days
curl -s "https://<host>/api/entries?from=2025-11-05&to=2025-11-12"   -H "Authorization: Bearer <token>"

# Create entry
curl -sX POST https://<host>/api/entries   -H "Authorization: Bearer <token>" -H "Content-Type: application/json"   -d '{"date":"2025-11-12","type":"Run (min)","quantity":30}'
```

---

### Notes
- All endpoints return JSON; dates use ISO 8601.
- Auth uses Bearer JWT.
- Rate limiting (suggestion): 60 req/min per user.
