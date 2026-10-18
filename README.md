# Grievance Portal — Backend

Backend for the **College Grievance Redressal System**. Students report grievances through the **Student Portal**, and Students Union admins review and resolve them through the separate **Admin Portal**. Both portals talk to this one backend, which stores everything in a single MongoDB database.

> **New here?** Read this file top to bottom once. It explains what every folder and file does, how a request travels through the code, and how to run the project.

---

## Tech Stack

| Tool | What we use it for |
|---|---|
| **Node.js** | Runs JavaScript on the server |
| **Express.js** | Creates the server and the API routes |
| **MongoDB (Atlas)** | Cloud database where all data is stored |
| **Mongoose** | Defines the shape of our data and talks to MongoDB |
| **bcrypt** | Hashes passwords so we never store them as plain text |
| **JWT (jsonwebtoken)** | Gives logged-in users a token to prove who they are |
| **multer** | Handles file uploads (grievance attachments) |
| **cors** | Allows only our two portals to call this API |
| **dotenv** | Loads secret settings from the `.env` file |
| **nodemon** | Restarts the server automatically while developing |
| **Postman** | Testing APIs before the frontend is connected |

---

## Getting Started

### 1. Install dependencies

```bash
cd Grievances-Portal-Backend
npm install
```

### 2. Create your `.env` file

Create a file named `.env` in the project root (next to `server.js`):

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_secret_string
ALLOWED_EMAIL_DOMAIN=psgtech.ac.in
STUDENT_PORTAL_URL=http://localhost:5173
ADMIN_PORTAL_URL=http://localhost:5174
```

> ⚠️ **Never commit `.env` to GitHub.** It contains your database password and JWT secret.

- **`MONGODB_URI`**: create one from your MongoDB Atlas account.
- **`JWT_SECRET`**: any long random string (e.g. `samplestring711ysuz82xwqs`).


### 3. Create admin accounts

Admins cannot sign up themselves, and there is no admin register API. For now, a senior adds admin accounts directly to the `admins` collection in MongoDB Atlas.

> ⚠️ The `password` field must be a **bcrypt hash**, not the plain password. Login compares the typed password against this hash, so a plain-text password will never match.

### 4. Start the server

```bash
npm run dev     # development (auto-restarts on save)
npm start       # normal run
```

The server runs at `http://localhost:5000`.

### Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the server with nodemon (restarts on file changes) |
| `npm start` | Starts the server normally |

---

## Folder Structure

```
Grievances-Portal-Backend/
├── server.js
├── app.js
├── config/
├── models/
├── routes/
│   ├── student/
│   └── admin/
├── controllers/
│   ├── student/
│   └── admin/
├── middleware/
├── services/
├── utils/
├── uploads/
├── .env
├── .gitignore
├── package.json
└── README.md
```



## What Each File Does

### Root files

| File | Purpose |
|---|---|
| `server.js` | **Entry point.** Loads `.env`, connects to MongoDB, then starts the server on `PORT`. This is the file Node runs. |
| `app.js` | **Builds the Express app.** Adds JSON parsing and CORS, mounts all routes under `/api/v1/...`, and attaches the error handler last. Kept separate from `server.js` so the app can be tested without starting a real server. |
| `.env` | Secret settings (database URL, JWT secret). **Not in GitHub.** |
| `.gitignore` | Tells Git to ignore `.env`, `node_modules/`, and uploaded files. |
| `package.json` | Lists dependencies and npm scripts. |

### `config/` — setup and settings

| File | Purpose |
|---|---|
| `database.js` | Connects to MongoDB Atlas using `MONGODB_URI`. Logs success or stops the app if the connection fails. |
| `cors.js` | Lists which websites may call our API: only the Student Portal and Admin Portal URLs from `.env`. Requests from anywhere else are blocked by the browser. |

### `models/` — shape of our data

| File | Purpose |
|---|---|
| `Student.js` | A student account: `name`, `rollNo`, `email`, `password` (hashed), timestamps. |
| `Admin.js` | An admin account: `name`, `email`, `designation` (office bearer / faculty advisor / dean), `password` (hashed). Kept separate from students because the SRS requires two separate portals. |
| `Grievance.js` | The main record. Holds `grievanceId`, `type`, `category`, `title`, `description`, `concernedPerson`, `attachment` details, `reporter` (link to the student), `status`, and the `actionHistory` array. |

**About `actionHistory`:** every status change or remark adds a new entry (date, status, remark, action taken, which admin did it). **Old entries are never deleted or edited** — this is the grievance's permanent timeline.

**About `attachment`:** the database only stores file *details* (original name, stored name, path, type, size). The actual file lives in the `uploads/` folder.

### `routes/` — the API endpoints

Routes only say **which URL** goes to **which controller**, and **which middleware** runs first. No logic here.

#### `routes/student/`

| File | Endpoints |
|---|---|
| `studentAuthRoutes.js` | `POST /api/v1/student/auth/register` — create account<br>`POST /api/v1/student/auth/login` — log in, get token<br>`GET /api/v1/student/auth/me` — get logged-in student's info |
| `studentGrievanceRoutes.js` | `POST /api/v1/student/grievances` — submit a grievance<br>`GET /api/v1/student/grievances` — list **my** grievances<br>`GET /api/v1/student/grievances/:id` — view one of **my** grievances with history<br>`GET /api/v1/student/grievances/:id/attachment` — download my attachment |

#### `routes/admin/`

| File | Endpoints |
|---|---|
| `adminAuthRoutes.js` | `POST /api/v1/admin/auth/login` — admin login (no register)<br>`GET /api/v1/admin/auth/me` — get logged-in admin's info |
| `dashboardRoutes.js` | `GET /api/v1/admin/dashboard/stats` — counts of grievances by status |
| `adminGrievanceRoutes.js` | `GET /api/v1/admin/grievances` — list all, with `?search=&status=&category=&type=`<br>`GET /api/v1/admin/grievances/:id` — full details incl. reporter<br>`GET /api/v1/admin/grievances/:id/attachment` — download attachment<br>`POST /api/v1/admin/grievances/:id/remarks` — add a remark<br>`PATCH /api/v1/admin/grievances/:id/status` — change status |

### `controllers/` — handling each request

A controller reads the request, calls services/models, and sends back the response with the right status code.

#### `controllers/student/`

| File | Purpose |
|---|---|
| `studentAuthController.js` | **register:** checks the email is unique, hashes the password, saves the student.<br>**login:** finds the student by email, compares passwords with bcrypt, returns a JWT.<br>**me:** returns the current student (never the password). |
| `studentGrievanceController.js` | **submit:** creates a grievance for the logged-in student and returns the Grievance ID.<br>**list:** returns only the logged-in student's grievances.<br>**getOne:** returns full details and action history of one of their grievances.<br>**attachment:** sends the file if it belongs to them. |

#### `controllers/admin/`

| File | Purpose |
|---|---|
| `adminAuthController.js` | **login:** finds admin by email, compares password, returns a JWT.<br>**me:** returns the current admin. |
| `dashboardController.js` | Counts grievances grouped by status (using a MongoDB aggregation) for the dashboard cards. |
| `adminGrievanceController.js` | **list:** all grievances with search and filters.<br>**getOne:** full details including reporter info, concerned person, attachments.<br>**addRemark:** adds a remark to history without changing status.<br>**updateStatus:** changes status and records it in history. |

### `middleware/` — checks that run before the controller

Middleware runs **in order**, between the route and the controller. If a check fails, the request stops there with an error.

| File | Purpose |
|---|---|
| `authenticate.js` | Reads the token from the `Authorization: Bearer <token>` header and verifies it. If valid, puts the user's info on `req.user`. If missing or invalid → **401**. |
| `requireStudent.js` | Allows only users with role `student`. Otherwise → **403**. |
| `requireAdmin.js` | Allows only users with role `admin`. Otherwise → **403**. |
| `ownGrievanceOnly.js` | Makes sure the grievance being opened belongs to the logged-in student. If not → **404** (we don't even reveal it exists). |
| `validateAuth.js` | Checks register/login input: valid email, college email domain, password rules. Bad input → **400**. |
| `validateGrievance.js` | Checks grievance input: type and category are from the allowed lists, title and description are present, and `concernedPerson` is filled when type is `against_individual`. Bad input → **400**. |
| `upload.js` | multer setup. Saves attachments into `uploads/` with a unique name, and only allows certain file types and sizes. |
| `errorHandler.js` | **Catches every error** in one place and sends a clean JSON response with the right status code. Registered last in `app.js`. |

### `services/` — reusable logic

Services hold logic used in more than one place, so controllers stay small.

| File | Purpose |
|---|---|
| `passwordService.js` | `hashPassword()` and `comparePassword()` using bcrypt. Used by both student and admin auth. |
| `tokenService.js` | `signToken()` and `verifyToken()` using JWT and `JWT_SECRET`. Used by both portals. |
| `grievanceService.js` | Creates a new grievance: sets the reporter, generates the ID, sets status to `submitted`, and adds the first history entry. **These values come from the backend, never from the frontend.** |
| `historyService.js` | Adds a new entry to a grievance's `actionHistory`. Only ever *adds* — never deletes or edits. |
| `statusService.js` | Checks that a status change is allowed (e.g. a `resolved` grievance can't go back to `submitted`). |
| `idService.js` | Generates readable Grievance IDs like `GRV-2026-001`. |

### `utils/`

| File | Purpose |
|---|---|
| `constants.js` | The fixed lists used everywhere: roles, grievance types, categories, and statuses. **Change values here only**, never type them out by hand in other files. |

Current values:

```
Types      : against_individual, general_issue
Categories : academic, infrastructure, hostel, transport,
             clubs_activities, administration, other
Statuses   : submitted → under_review → action_taken → resolved
             (dismissed can be set from any open status)
```

### `uploads/`

Stores attachment files uploaded by students.

- Files here are **private**. They are **not** served publicly — only through the protected attachment routes above.
- The folder is ignored by Git (except `.gitkeep`, which keeps the empty folder in the repo).
- On free hosting, this folder may be wiped on redeploy. Later we can move to cloud storage (Cloudinary/S3) by changing only `upload.js`.

---

## API Endpoints

All endpoints start with `/api/v1`. "Token" means the request must include `Authorization: Bearer <token>`.

### Student Portal

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/student/auth/register` | Public | Create a student account |
| POST | `/student/auth/login` | Public | Log in and get a token |
| GET | `/student/auth/me` | Student token | Get the logged-in student's info |
| POST | `/student/grievances` | Student token | Submit a grievance (returns Grievance ID) |
| GET | `/student/grievances` | Student token | List **my** grievances |
| GET | `/student/grievances/:id` | Student token (own only) | View one of my grievances with its action history |
| GET | `/student/grievances/:id/attachment` | Student token (own only) | Download my attachment |

### Admin Portal

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/admin/auth/login` | Public | Admin login (no register) |
| GET | `/admin/auth/me` | Admin token | Get the logged-in admin's info |
| GET | `/admin/dashboard/stats` | Admin token | Grievance counts by status |
| GET | `/admin/grievances` | Admin token | List all grievances. Filters: `?search=&status=&category=&type=` |
| GET | `/admin/grievances/:id` | Admin token | Full grievance details, including reporter |
| GET | `/admin/grievances/:id/attachment` | Admin token | Download a grievance's attachment |
| POST | `/admin/grievances/:id/remarks` | Admin token | Add a remark (status unchanged) |
| PATCH | `/admin/grievances/:id/status` | Admin token | Change status and record it in history |

---

## How a Request Flows

### Example 1: Student submits a grievance

```
Student Portal (React form)
   ↓  POST /api/v1/student/grievances  (with token)
app.js                    → sends it to studentGrievanceRoutes.js
authenticate.js           → is the token valid?
requireStudent.js         → is this a student?
upload.js                 → save the attachment, if any
validateGrievance.js      → is the input correct?
studentGrievanceController.submit
   ↓ calls
grievanceService          → set reporter, ID, status, first history entry
   ↓
Grievance model → MongoDB
   ↓
201 Created + Grievance ID → back to the Student Portal
```

### Example 2: Admin updates a status

```
Admin Portal
   ↓  PATCH /api/v1/admin/grievances/:id/status  (with token)
authenticate.js           → is the token valid?
requireAdmin.js           → is this an admin?
adminGrievanceController.updateStatus
   ↓ calls
statusService             → is this status change allowed?
historyService            → add entry to actionHistory
   ↓
MongoDB (shared database)
   ↓
200 OK → the student sees the new status next time they open the grievance
```

---

## Authentication in Simple Words

1. **Register (students only):** the password is hashed with bcrypt before saving. Even we cannot read it.
2. **Login:** bcrypt compares the typed password with the stored hash. If they match, the server creates a **JWT token**.
3. **After login:** the frontend sends the token with every request:
   ```
   Authorization: Bearer <token>
   ```
4. **Authentication** = "Who are you?" → `authenticate.js`
   **Authorization** = "Are you allowed to do this?" → `requireStudent.js`, `requireAdmin.js`, `ownGrievanceOnly.js`

> A student must never be able to use admin APIs just by changing a URL. That's why **every** check happens in the backend, not only in the frontend.

---

## HTTP Status Codes We Use

| Code | Meaning | Example |
|---|---|---|
| 200 | OK | Fetched grievances |
| 201 | Created | Grievance submitted |
| 400 | Bad request | Missing title |
| 401 | Not logged in | No/invalid token |
| 403 | Not allowed | Student calling admin API |
| 404 | Not found | Grievance doesn't exist (or isn't yours) |
| 500 | Server error | Something broke on our side |

Error responses always look like:

```json
{ "message": "You are not authorized to access this grievance." }
```

---

## Testing with Postman

1. Start the server with `npm run dev`.
2. Call the login API and copy the `token` from the response.
3. For protected APIs, go to **Authorization → Bearer Token** and paste it.
4. Test both portals:
   - Log in as a student → submit, list, and view grievances.
   - Log in as an admin → view dashboard, list, add remark, change status.
5. **Try to break it:** call an admin API with a student token (should get 403), or open another student's grievance (should get 404).

---

## Rules for Contributors

- ✅ Keep secrets in `.env`, never in code.
- ✅ Use values from `utils/constants.js` instead of typing strings like `"under_review"` by hand.
- ✅ Validate all input in middleware before it reaches the controller.
- ✅ Never return a `password` field in any response.
- ✅ Never delete or edit old `actionHistory` entries.
- ✅ Let the backend set `reporter`, `grievanceId`, `status`, and dates — never trust the frontend for these.
- ❌ Don't put business logic in route files.
- ❌ Don't commit `.env`, `node_modules/`, or uploaded files.

---
---

## Planned for Later

- Pagination for long grievance lists
- Cloud file storage (Cloudinary / S3)
- Admin "change password" option
- A seed script to create admin accounts automatically
- Auto-refreshing status on the Student Portal