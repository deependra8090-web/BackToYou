# 🎒 Smart Campus Lost & Found Management System

A full-stack web application that helps students and staff report, find, and recover lost items on campus using intelligent matching and admin verification.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Multer Upload Path](#multer-upload-path)
- [Default Admin Account](#default-admin-account)
- [API Overview](#api-overview)

---

## ✨ Features

- Report lost and found items with images, location, and keywords
- Smart matching between lost and found reports
- Admin dashboard for item verification, user management, and claim review
- User dashboard with personal stats, matches, and claims
- JWT-based authentication with role-based access (user / admin)
- Image upload with cloudinary
- Responsive UI for mobile and desktop

---

## 🛠 Tech Stack

### Frontend

| Tool                  | Purpose                     |
| --------------------- | --------------------------- |
| React 19 + Vite       | UI framework and dev server |
| TanStack Query v5     | Server state management     |
| React Router v7       | Client-side routing         |
| Tailwind CSS          | Styling                     |
| React Hook Form + Zod | Form validation             |
| Lucide React          | Icons                       |
| Sonner                | Toast notifications         |
| js-cookie             | Cookie management           |

### Backend

| Tool               | Purpose             |
| ------------------ | ------------------- |
| Node.js + Express  | Server framework    |
| MongoDB + Mongoose | Database            |
| JWT                | Authentication      |
| bcrypt             | Password hashing    |
| Multer             | File/image upload   |
| express-validator  | Request validation  |
| Winston            | Logging             |
| http-status-codes  | HTTP status helpers |
