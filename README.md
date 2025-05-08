
---

````markdown
# 🧩 TsumuX Backend Template

A modular, production-ready Express backend boilerplate designed for scalable APIs. It features dynamic route loading, JWT authentication, MySQL integration, and React frontend handling — all pre-configured to jumpstart your backend projects.

---

## 🚀 Features

- **Dynamic API Loading**: Automatically loads all route files in a specified directory.
- **JWT Token Handler**: Easily generate and verify tokens for user sessions.
- **Role-Based Authorization**: Fine-grained role permissions (`visitor`, `user`, `admin`).
- **MySQL Query Wrapper**: Lightweight connection pool with asynchronous query execution.
- **Setup**: Built-in support for `.env`, CORS, and JSON body parsing.
- **React Frontend Handling**: Serve a React app directly from the backend, with automatic serving of `index.html` and static files for optimized delivery.
- **Modular Rate Limiting**: Dynamically enable and configure request throttling for your API with one function.

---

## ⚙️ Environment Variables

Create a `.env` file in the root folder with the following variables:

```env
SERVER_PORT=3000

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=tsumux_db

# JWT Secret
ACCESS_CODE=your_jwt_secret

# React Frontend Path (optional)
FRONTEND_PATH=path/to/your/frontend/build

# Admin
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
````

---

## 🧪 Usage Examples

### 1. 📡 Dynamic API Endpoint

```ts
// File: API/hello.ts
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
})

export default router;
```

**Access it via:** `GET /api/hello`

---

### 2. 🔐 Generate Token

```ts
import { generateToken } from '../middleware/token-handler';

const token = await generateToken(7, { id: 123, role: 'user' }); // expires in 7 days
console.log(token);
```

---

### 3. 🔍 Verify Token Middleware

```ts
import { Router } from 'express';
import { verifyToken } from '../middleware/token-handler';

const router = Router();

router.get('/profile', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

export default router;
```

---

### 4. 🧱 Check Role Authorization

```ts
import { checkRolePermission } from '../middleware/authorization';

const canAccess = await checkRolePermission('user', 'visitor');
console.log(canAccess); // true
```

---

### 5. 📘 MySQL Query Example

```ts
import { executeQuery } from '../config/database';

const users = await executeQuery('SELECT * FROM users WHERE age > ?', [18]);
console.log(users);
```

---

### 6. 🎨 Serve React App

```ts
import express from 'express';
import { loadReactApp } from './middleware/react-handler';

const app = express();

// Serve React app
loadReactApp(app, process.env.FRONTEND_PATH || './frontend/build');

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
```

---

### 7. 🚦 Enable Rate Limiter

You can dynamically enable rate limiting by calling `setLimiterOptions` before starting the server:

```ts
// File: app.ts or server.ts
import express from 'express';
import { setLimiterOptions, getLimiterMiddleware } from './middleware/rateLimiter';

const app = express();

// Enable rate limiting: 10 requests per 60 seconds
setLimiterOptions(60, 10, "Terlalu banyak request, coba lagi nanti", 429);

// Apply middleware only if enabled
const limiter = getLimiterMiddleware();
if (limiter) app.use(limiter);
```

This approach makes your limiter optional and fully configurable.

---

## 🛠️ Getting Started

### 1. Using NPX

```bash
npx degit MuhRaihan001/backend-template my-new-project
cd my-new-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up `.env`

Fill in the environment variables as shown above.

### 4. Start the Server

```bash
npm run build # To build typescript -> dist/
npm start # Start build result
npm run dev # To test typescript (ts-node)
```

---

## 🧩 Customize Your API

To add new routes, simply drop new `.ts` or `.js` files inside the `API/` folder. The file path becomes the URL path:

```txt
API/user/login.ts → /api/user/login
```

No need to register them manually — it just works™️.

---

## 📄 License

MIT License © 2025 TsumuX

```

---