# Ashik Portfolio — Express.js & MongoDB Backend

Backend API server for Ashik's portfolio.

## 🚀 Features
- **Express.js** REST API with CORS and structured error handling.
- **MongoDB** integration with **Mongoose** (with graceful in-memory fallback).
- **Contact API** (`POST /api/contact`, `GET /api/contact`): Validates and stores incoming inquiries.
- **Portfolio API** (`GET /api/portfolio/profile`, `GET /api/portfolio/skills`, `GET /api/portfolio/projects`).
- **Health Check** (`GET /api/health`).

## 🛠️ Quickstart

```bash
cd portfolio/backend
npm install
npm run dev
```

Server runs on: **http://localhost:5000**

