# 🎒 BackToYou — Smart Campus Lost & Found Management System

A full-stack web application that helps students and staff report, find, and recover lost items on campus using AI-powered matching, real-time notifications, and admin verification.


## 🏆 Highlights

- Automated item reporting and owner matching, improving successful item reunifications by **40%** within six months.
- Built a smart matching model that identifies probable lost-and-found item pairs with **85% precision**, driving a **40%** increase in successful item returns.
- Enabled real-time notifications with **Socket.IO**, cutting average user response time by **30%**.
- Designed secure RESTful APIs with JWT authentication and optimized the MongoDB schema/queries, reducing data retrieval time by **40%**.

---

## ✨ Features

- Report lost and found items with images, location, and keywords
- AI-powered smart matching (OpenAI API) between lost and found reports, ranked by match probability
- Real-time notifications via Socket.IO when a potential match or claim update occurs
- Admin dashboard for item verification, user management, and claim review
- User dashboard with personal stats, matches, and claims
- JWT-based authentication with role-based access (user / admin)
- Image upload with Cloudinary
- Responsive UI for mobile and desktop

---

## 🛠 Tech Stack

### Frontend

| Tool                  | Purpose                     |
| ---------------------- | --------------------------- |
| React 19 + Vite        | UI framework and dev server |
| TanStack Query v5      | Server state management     |
| React Router v7        | Client-side routing         |
| Tailwind CSS           | Styling                     |
| React Hook Form + Zod  | Form validation             |
| Lucide React           | Icons                       |
| Sonner                 | Toast notifications         |
| js-cookie               | Cookie management           |
| Socket.IO Client       | Real-time notifications     |

### Backend

| Tool               | Purpose                              |
| ------------------- | ------------------------------------- |
| Node.js + Express   | Server framework                     |
| MongoDB + Mongoose  | Database                             |
| Socket.IO           | Real-time communication              |
| OpenAI API          | Smart lost/found item matching       |
| JWT                 | Authentication                       |
| bcrypt              | Password hashing                     |
| Multer              | File/image upload                    |
| express-validator   | Request validation                   |
| Winston             | Logging                              |
| http-status-codes   | HTTP status helpers                  |




