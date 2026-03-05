# 🏠 Dwello - Student Housing Platform

> India's #1 platform for students to find PG and Flat accommodations near their college.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [API Reference](#api-reference)
- [User Roles & Credentials](#user-roles--credentials)
- [Deployment](#deployment)

---

## Overview

Dwello is a full-stack web application that connects college students with property owners offering PG accommodations and flats near campuses. It features role-based access for students, owners, and admins.

---

## Features

### For Students
- 🔍 Search properties by college, city, budget, gender preference, amenities
- 🏠 View detailed property pages with images, amenities, and Google Maps location
- ❤️ Save favorite properties
- ⭐ Leave reviews and ratings
- 📞 Contact property owners directly

### For Property Owners
- ➕ List PG/Flat properties with images
- ✏️ Edit and manage listings
- 📊 Owner dashboard with view counts and ratings
- 🔄 Toggle property availability

### For Admins
- 📊 Dashboard with user and listing statistics
- 👥 Manage users (activate/deactivate)
- 🏘️ Approve/remove property listings
- 🔍 Search and filter all users and properties

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Tailwind CSS 3 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Image Upload | Cloudinary |
| Maps | Google Maps Embed API |
| Validation | express-validator |
| Security | Helmet, express-rate-limit, bcryptjs |

---

## Project Structure

```
Dwello/
├── server/                         # Backend (Node.js + Express)
│   ├── config/                     # Configuration files
│   ├── controllers/                # Route controllers
│   │   ├── authController.js       # Auth logic
│   │   ├── propertyController.js   # Property CRUD
│   │   ├── reviewController.js     # Reviews
│   │   ├── favoriteController.js   # Favorites
│   │   └── adminController.js      # Admin management
│   ├── middleware/
│   │   └── auth.js                 # JWT middleware
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   ├── Property.js             # Property schema
│   │   └── Review.js               # Review schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── reviews.js
│   │   ├── favorites.js
│   │   ├── users.js
│   │   ├── admin.js
│   │   └── upload.js
│   ├── data/
│   │   └── seed.js                 # Sample data seeder
│   ├── .env.example
│   ├── package.json
│   └── index.js                    # App entry point
│
└── client/                         # Frontend (React.js)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/             # Navbar, Footer, Spinner
    │   │   ├── property/           # PropertyCard, SearchFilters
    │   │   └── dashboard/          # PropertyForm
    │   ├── context/
    │   │   └── AuthContext.js      # Global auth state
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Properties.js
    │   │   ├── PropertyDetail.js
    │   │   ├── Favorites.js
    │   │   ├── Profile.js
    │   │   ├── dashboard/          # Owner pages
    │   │   └── admin/              # Admin pages
    │   ├── services/
    │   │   └── api.js              # Axios instance
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    ├── tailwind.config.js
    └── package.json
```

---

## Prerequisites

Make sure you have installed:

- **Node.js** >= 16.x — [Download](https://nodejs.org)
- **MongoDB** >= 5.x (local) or a [MongoDB Atlas](https://www.mongodb.com/atlas) account
- **npm** >= 8.x (comes with Node.js)
- **Git**

---

## Installation & Setup

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/Dwello.git
cd Dwello
```

### Step 2: Set up the Backend

```bash
cd server

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)
```

### Step 3: Set up the Frontend

```bash
cd ../client

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Add your Google Maps API key
```

### Step 4: Start MongoDB

**Option A - Local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B - MongoDB Atlas:**
Use the connection string from Atlas in your `MONGODB_URI` environment variable.

### Step 5: Seed the Database (Optional but recommended)

```bash
cd server
npm run seed
```

This creates sample users, properties, and reviews for testing.

### Step 6: Start the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev     # Development (with nodemon)
# or
npm start       # Production
```

Server starts at: `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

App opens at: `http://localhost:3000`

---

## Environment Variables

### Server (`server/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/Dwello

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

> **Cloudinary Setup:**
> 1. Create free account at [cloudinary.com](https://cloudinary.com)
> 2. Find your credentials in the Dashboard
> 3. Add them to `.env`
> 
> Without Cloudinary configured, placeholder images from Picsum are used automatically.

### Client (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> **Google Maps Setup:**
> 1. Go to [Google Cloud Console](https://console.cloud.google.com)
> 2. Enable Maps Embed API
> 3. Create an API key and add it above
>
> Without the key, a static location link is shown instead of an embedded map.

---

## Database Seeding

Run the seeder to populate the database with sample data:

```bash
cd server
npm run seed
```

This creates:
- 5 users (1 admin, 2 students, 2 owners)
- 6 properties across Indian cities
- 4 sample reviews

---

## API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/update-profile` | Update profile | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Properties
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/properties` | Get all properties (with filters) | No |
| GET | `/api/properties/featured` | Get featured properties | No |
| GET | `/api/properties/:id` | Get single property | No |
| POST | `/api/properties` | Create property | Owner/Admin |
| PUT | `/api/properties/:id` | Update property | Owner/Admin |
| DELETE | `/api/properties/:id` | Delete property | Owner/Admin |
| GET | `/api/properties/my-listings` | Owner's listings | Owner/Admin |

### Query Parameters for GET /api/properties
```
college     - Filter by nearby college name
city        - Filter by city
minPrice    - Minimum monthly rent
maxPrice    - Maximum monthly rent
gender      - Boys / Girls / Co-ed
type        - PG / Flat / Hostel / Room
amenities   - Comma-separated: wifi,food,parking,ac
sort        - price_asc / price_desc / rating / popular
page        - Page number (default: 1)
limit       - Results per page (default: 12)
search      - Text search
lat, lng    - Coordinates for geospatial search
radius      - Radius in km (default: 5)
```

### Favorites
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/favorites` | Get saved properties | Student |
| POST | `/api/favorites/:propertyId` | Toggle save/unsave | Student |

### Reviews
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/reviews/:propertyId` | Get reviews for property | No |
| POST | `/api/reviews/:propertyId` | Add review | Student |
| DELETE | `/api/reviews/:id` | Delete review | Owner of review / Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Dashboard stats | Admin |
| GET | `/api/admin/users` | List all users | Admin |
| PATCH | `/api/admin/users/:id/toggle` | Activate/deactivate user | Admin |
| GET | `/api/admin/properties` | All properties | Admin |
| PATCH | `/api/admin/properties/:id/approve` | Approve/unapprove | Admin |
| DELETE | `/api/admin/properties/:id` | Remove property | Admin |

---

## User Roles & Credentials

After seeding, use these credentials to test:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 🎓 Student | rahul@example.com | password123 | Browse, search, save, review |
| 🎓 Student | priya@example.com | password123 | Browse, search, save, review |
| 🏠 Owner | suresh@example.com | password123 | List, edit, delete properties |
| 🏠 Owner | meena@example.com | password123 | List, edit, delete properties |
| ⚙️ Admin | admin@Dwello.com | admin123 | Full access |

---

## Deployment

### Backend (Railway / Render / Heroku)

1. Push code to GitHub
2. Connect repository to your hosting service
3. Set environment variables (from `.env`) in the dashboard
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend (Vercel / Netlify)

1. Push `client/` to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `build`
5. Add environment variables:
   - `REACT_APP_API_URL` = your backend URL
   - `REACT_APP_GOOGLE_MAPS_API_KEY` = your key

---

## 📦 Available Scripts

### Server
```bash
npm run dev     # Start with nodemon (hot reload)
npm start       # Start production server
npm run seed    # Seed database with sample data
```

### Client
```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
```

---

## License

MIT License — free to use and modify.

---

Made with ❤️ for students across India 🇮🇳
