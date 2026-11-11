# Ashik — Full-Stack Portfolio

A high-performance portfolio website built with **Next.js 14**, **Tailwind CSS**, **Express.js**, **MongoDB Atlas**, and **Cloudinary CDN**. 

---

## 🏗️ Architecture & Project Structure

```text
portfolio/
├── frontend/                   # Next.js 14 App Router + Tailwind CSS
│   ├── public/                 # Static assets & scripts
│   │   ├── ashik-portrait.webp     # High-res color cutout portrait
│   │   ├── ashik-portrait-bw.webp  # Monochrome base hero portrait
│   │   ├── portfolio-main.js       # Master interactive client engine
│   │   ├── powerlifter/            # 3D strength matrix engine & lifts telemetry
│   │   ├── fonts/                  # Custom Onest variable web fonts
│   │   └── card/                   # 3D holographic card textures
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.js           # Root layout with Onest font & metadata
│   │   │   ├── globals.css         # Full 1:1 stylesheet with viewport rem scaling
│   │   │   ├── page.js             # Interactive Homepage
│   │   │   ├── web-developer/      # Web Developer room
│   │   │   ├── app-developer/      # App Developer room
│   │   │   ├── ui-ux-designer/     # UI/UX Designer room
│   │   │   ├── devops-engineer/    # DevOps Engineer room
│   │   │   ├── powerlifter/        # Powerlifter 3D floating room & video player
│   │   │   └── legal/              # Legal & open source credits
│   │   ├── config/
│   │   │   ├── cloudinary-assets.json # Complete Cloudinary CDN manifest
│   │   │   └── cloudinary.js       # Asset helper module
│   │   └── components/
│   │       ├── Navbar.js           # Header, clock, pull-cord mode toggle
│   │       ├── FlipCalendar.js     # Desk-calendar flipping skill badge
│   │       ├── LiquidReveal.js     # Canvas interactive cursor ripple portrait
│   │       ├── HoloCard.js         # 3D interactive holographic tilt ability card
│   │       ├── DoorWall.js         # 3D swinging doors to showcase rooms
│   │       ├── StoryTimeline.js    # Interactive career & athletic journey
│   │       └── ContactForm.js      # Wired to Express + MongoDB backend
│   ├── next.config.js          # Cloudinary remote patterns & API rewrites
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
└── backend/                    # Express.js REST API + MongoDB Atlas
    ├── src/
    │   ├── config/
    │   │   ├── db.js           # MongoDB connection with DNS fallback & in-memory backup
    │   │   └── cloudinary-assets.json
    │   ├── models/
    │   │   ├── Message.js      # Contact inquiry schema (persisted to MongoDB)
    │   │   └── Project.js      # Dynamic projects schema
    │   ├── routes/
    │   │   ├── contact.js      # POST /api/contact, GET /api/contact
    │   │   └── portfolio.js    # Profile, skills, and projects endpoints
    │   └── server.js           # Express app entrypoint & middleware
    ├── .env.example
    └── package.json
```

---

## ⚡ Quickstart

### 1. Environment Setup
Create environment files from the provided examples:
```bash
# In portfolio/backend/
cp .env.example .env
# Fill in your MONGODB_URI, CLOUDINARY credentials

# In portfolio/frontend/
cp .env.example .env.local
```

### 2. One-Command Launch (Backend + Frontend)
From the root `portfolio/` directory:
```bash
cd portfolio
npm run dev
```
- **Frontend**: http://localhost:3000
- **Powerlifter Room**: http://localhost:3000/powerlifter
- **Backend API**: http://localhost:5000/api/health

---

## 🛡️ Security & Privacy Measures

1. **Environment Secrets Protection**:
   - All `.env` and `.env.*` files are strictly ignored via `.gitignore` to prevent secret leaks.
   - Database connection URIs and Cloudinary credentials reside exclusively in server-side environment variables.

2. **API Rate Limiting & DoS Protection**:
   - In-memory sliding-window IP rate limiter on `/api/contact` (max 10 requests / 15 minutes per IP).
   - Strict body size limit (`50kb`) prevents memory exhaustion attacks.

3. **Input Sanitization & NoSQL Injection Defense**:
   - Field type enforcement (`typeof === 'string'`) prevents MongoDB operator injection.
   - Automatic HTML entity escaping on incoming strings defends against Stored XSS.
   - Enforced maximum field lengths (Name: 80 chars, Email: 120 chars, Message: 3,000 chars).

4. **HTTP Security Headers & CORS**:
   - Enforced `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
   - `X-Frame-Options: SAMEORIGIN` permits same-origin 3D door walk-through iframes while blocking external clickjacking.
   - Disabled Express signature (`x-powered-by`).
   - Restricted CORS to authorized origins in production mode.

5. **Inquiry Data Privacy**:
   - `GET /api/contact` requires an `x-admin-key` header in production, preventing unauthorized public scraping of user emails and messages.

---

## 🌟 Interactive Experience

1. **Liquid Canvas Reveal**:
   - Base monochrome portrait reveals authentic color under mouse cursor movement using dynamic canvas compositing.

2. **3D Holographic Ability Card**:
   - Specular reflections and sheen masks computed using mouse coordinates with 3D perspective flip.

3. **3D Wall of Doors**:
   - Door frames open smoothly on hover with spring physics; clicking walks through into dedicated rooms with seamless iframe preloading.

4. **Powerlifting & Strength Room**:
   - Ambient starfield sky canvas with draggable infinite matrix.
   - Real-time Big 3 PR telemetry HUD (`Total: 585 kg · SQ: 205 kg · BP: 145 kg · DL: 235 kg`).
   - Fullscreen video lightbox with HTML5 video streaming and lifting metadata sidecar panel.

5. **Theme Switcher**:
   - Interactive pull-cord switch with spring physics and local storage persistence.

---

## 📄 License
MIT © Ashik
