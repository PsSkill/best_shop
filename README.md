# ?? Best Shop — Inventory & Stock Management System

A full-stack web application for managing retail shop inventory, stock entries, sales tracking, and multi-location operations. Built for **Best Shop Sathy**, it supports multiple shop locations, role-based user access, and rich dashboards.

---

## ?? Table of Contents

- [What It Does](#what-it-does)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)

---

## What It Does

Best Shop is a **retail inventory management system** designed for a clothing/footwear shop chain operating across multiple locations. It allows shop staff to:

- **Add incoming stock** from suppliers, catalogued by category, sub-category, brand, model, colour, size, occasion, and type
- **Track stock per shop location** and per date
- **View dashboards** showing available inventory, sales trends, and stock aging (< 30 days, 30–180 days, 180–365 days)
- **Export stock data** as structured reports (CSV-ready JSON) filtered by date, shop, and bill number
- **Import stock** in bulk
- **Manage product catalogue** (categories, brands, models, colours, sizes, occasions, types)
- **Manage shop locations**, user accounts, and roles
- **View product pages** showing available quantity per item across the catalogue

---

## Tech Stack

### Frontend — `Best_Shop/`

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| MUI (Material UI v5) | UI component library |
| MUI X Data Grid | Tabular data display |
| MUI X Charts / ApexCharts | Dashboard charts |
| AG Charts | Advanced visualisation |
| React Select | Linked dropdown inputs |
| React Dropzone | Drag-and-drop file upload |
| Axios | HTTP client |
| js-cookie | JWT token storage in cookies |
| jwt-decode | Token payload extraction |
| React Toastify | Notifications |
| xlsx | Excel export |
| React Webcam | Camera capture |

### Backend — `js_bestshopbackend/`

| Technology | Purpose |
|---|---|
| Node.js + Express 4 | REST API server |
| MySQL 2 | Database driver (connection pool) |
| bcrypt | Password hashing |
| jsonwebtoken (JWT) | Stateless auth tokens |
| multer | Image file uploads |
| morgan | HTTP request logging |
| dotenv | Environment configuration |
| nodemon | Dev server with auto-reload |

---

## Project Structure

```
best_shop/
+-- Best_Shop/                    # React frontend
¦   +-- src/
¦       +-- App.js                # Routes & protected route guard
¦       +-- components/
¦       ¦   +-- Login/            # Login page
¦       ¦   +-- Signup/           # User registration
¦       ¦   +-- Home/             # Home/landing page
¦       ¦   +-- Stock_Dashboard/  # Main stock dashboard
¦       ¦   +-- Dashboards/       # Available stock dashboard
¦       ¦   +-- Products/         # Product listing dashboard
¦       ¦   +-- Inventory/        # Inventory view & model dashboard
¦       ¦   +-- stocks/           # Stock table (date-filtered)
¦       ¦   +-- add_product/      # Add new stock entry (multi-size)
¦       ¦   +-- import_data/      # Bulk stock import
¦       ¦   +-- export_data/      # Export stock as CSV/Excel
¦       ¦   +-- Horizontal_Navbar/# Top navigation bar
¦       ¦   +-- Vertical_Navbar/  # Side navigation
¦       ¦   +-- InputBox/         # Reusable input components
¦       +-- utils/
¦           +-- api.jsx           # Base API URL configuration
¦
+-- js_bestshopbackend/           # Node.js/Express backend
¦   +-- src/
¦       +-- app.js                # Express app entry point
¦       +-- config/
¦       ¦   +-- database.js       # MySQL connection pool
¦       ¦   +-- database_utlis.js # Reusable query helpers
¦       +-- controllers/
¦       ¦   +-- auth/             # login, logout, signup
¦       ¦   +-- stock/            # stock CRUD, dashboard, export, sales
¦       ¦   +-- structure/        # catalogue management (category?model)
¦       ¦   +-- master/           # shop locations, roles, product masters
¦       +-- middleware/
¦       ¦   +-- authenticate_token.js  # JWT verification
¦       ¦   +-- image_uploader.js      # multer image upload handler
¦       +-- routes/
¦           +-- auth/             # /api/auth
¦           +-- stock/            # /api/stock (protected)
¦           +-- structure/        # /api/structure (public)
¦           +-- master/           # /api/master (protected)
¦
+-- acan.sql                      # MySQL database schema (one-time setup)
```

---

## Features

### ?? Authentication
- JWT-based login with 24-hour token expiry
- Tokens stored in browser cookies
- Logout revokes the token (stored in `revoked_tokens` table)
- All protected routes check for valid, non-revoked token
- Passwords hashed with bcrypt (salt rounds: 10)

### ?? Stock Management
- **Add Stock**: Enter bill number, full product hierarchy (category ? item name ? sub-category ? brand ? model ? colour ? size(s)), quantities per size, and pricing (purchase price, selling price, MRP)
- **Multi-size entry**: Add stock for multiple sizes of the same product in a single submission
- **Date & time stamped**: Every entry records the exact date, time, and year
- **Update Stock**: Modify quantity, selling price, and MRP
- **Delete Stock**: Remove a specific stock entry by ID
- **View Stocks**: Filter by date and optionally by shop location

### ?? Dashboards
- **Stock Dashboard**: Shows stock aging buckets — items added < 30 days, 30–180 days, 180–365 days — with total quantity, total price, and average rate
- **Available Dashboard**: Shows total vs available (remaining sell) quantity per item name, filterable by category
- **Model Dashboard**: Drill down by item name to see total vs available quantity per model
- **Product Dashboard**: Overview of all products with category images and total count

### ??? Catalogue Management (Structure)
Manage the full product taxonomy:
- **Category** (with image upload)
- **Item Name** (linked to category, with image)
- **Sub-Category** (linked to item name, with image)
- **Brand** (linked to sub-category, with image)
- **Model** (linked to brand)
- **Colour** (linked to model)
- **Size** (linked to colour)
- **Occasion** (linked to size)
- **Type** (linked to occasion)

All entities support create, read, update, and soft-delete (status flag).

### ?? Master Data
- **Shop Locations**: Manage branch names (multi-location support)
- **Roles**: Define user roles (admin, staff, etc.)
- **Users**: Register users tied to a shop location and role

### ?? Export
Export stock data as structured JSON (consumed by frontend to generate CSV/Excel), filtered by:
- Date (required)
- Shop location (required)
- Bill number (optional)

Exported fields: Item Name, Qty, Purchase Price, Selling Price, MRP, Main Category, Sub Category, Brand, Sizes, Style Mode (Model), Colour, Occasion, Type.

### ??? Image Upload
Category, item name, sub-category, and brand entries can include images. Images are stored on disk under `src/uploads/images/` and served as static files via `/uploads`.

---

## Database Schema

The database (`bestshop_web`) contains **24 tables**.

### Core Catalogue Hierarchy

```
category
  +- item_name
       +- sub_category
            +- brand
                 +- model
                      +- color
                           +- size
                                +- occasion
                                     +- type
```

### Master Lookup Tables (pre-seeded, category-scoped)

| Table | Purpose |
|---|---|
| `master_brand` | Pre-seeded brand list per category |
| `master_color` | Pre-seeded colour list per category |
| `master_item_name` | Pre-seeded item names per category |
| `master_model` | Pre-seeded model names per category |
| `master_occasion` | Pre-seeded occasions per category |
| `master_size` | Pre-seeded sizes per category |
| `master_sub_category` | Pre-seeded sub-categories per category |
| `master_type` | Pre-seeded types per category |

### Operational Tables

| Table | Purpose |
|---|---|
| `stock` | All stock entries with full product details and pricing |
| `shop_location` | Branch/shop list |
| `master_user` | User accounts (location + role FK) |
| `master_roles` | Role definitions |
| `master_resources` | UI resource/route definitions |
| `roles_resources_mapping` | Role-to-resource access mapping |
| `revoked_tokens` | Invalidated JWT tokens |

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | ? | Login with username & password |
| POST | `/api/auth/signup` | ? | Register new user |
| POST | `/api/auth/logout` | ? | Revoke current JWT |

### Stock — `/api/stock` *(all protected)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stock/stock?date=&shop_location=` | Fetch stock entries by date |
| POST | `/api/stock/stock` | Add new stock entry (multi-size) |
| PUT | `/api/stock/stock` | Update stock quantity/price |
| DELETE | `/api/stock/stock` | Delete a stock entry |
| GET | `/api/stock/export-csv?date=&shop_location=&bill_number=` | Export stock data |
| GET | `/api/stock/dashboard-data` | Stock aging dashboard |
| GET | `/api/stock/shop-count` | Count of shop locations |
| GET | `/api/stock/shop-user` | Count of users |
| GET | `/api/stock/sales-dashboard?category=` | Available qty per item name |
| GET | `/api/stock/model-dashboard?item_name=` | Available qty per model |
| GET | `/api/stock/products` | All products with total counts |
| GET | `/api/stock/products/item?item_name=` | Product detail page data |

### Sales — `/api/sales`

| Method | Endpoint | Description |
|---|---|---|
| PUT | `/api/sales` | Update sell quantity (mark items as sold) |

### Structure — `/api/structure` *(public)*

Full CRUD (`GET`, `POST`, `PUT`, `DELETE`) for:  
`/category`, `/item-name`, `/sub-category`, `/brand`, `/model`, `/color`, `/size`, `/occasion`, `/type`

### Master — `/api/master` *(protected)*

| Method | Endpoint | Description |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/master/shop-location` | Manage shop branches |
| GET/POST/PUT/DELETE | `/api/master/role` | Manage user roles |
| GET | `/api/master/category` | Master category list |
| GET | `/api/master/brand?category_id=` | Master brands by category |
| GET | `/api/master/color?category_id=` | Master colours by category |
| GET | `/api/master/item-name?category_id=` | Master item names by category |
| GET | `/api/master/model?category_id=` | Master models by category |
| GET | `/api/master/occasion?category_id=` | Master occasions by category |
| GET | `/api/master/sub-category?category_id=` | Master sub-categories by category |
| GET | `/api/master/type?category_id=` | Master types by category |
| GET | `/api/master/size?category_id=` | Master sizes by category |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8
- npm

### 1. Database Setup *(one-time only)*

> ?? **Warning**: `acan.sql` contains `DROP TABLE IF EXISTS` for every table. Run it **only once** during initial setup — running it again will erase all data.

```bash
mysql -u root -p < acan.sql
```

### 2. Backend Setup

```bash
cd js_bestshopbackend
npm install
# Configure .env (see below)
npm run dev
```

API server runs on **http://localhost:5001**

### 3. Frontend Setup

```bash
cd Best_Shop
npm install
npm start
```

React app runs on **http://localhost:3000**

---

## Environment Variables

Create `js_bestshopbackend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bestshop_web
DEV_PORT=5001
JWT_SECRET=your_secret_key_here
```

The frontend API base URL is set in `Best_Shop/src/utils/api.jsx`:

```js
// Development
const apiHost = "http://localhost:5001";

// Production
// const apiHost = "https://app.bestshopsathy.in";
```

---

## Authentication Flow

```
1. POST /api/auth/login
     ? Server validates username + bcrypt password comparison
     ? Signs JWT (payload: { id, location }, expiry: 24h)
     ? Returns token

2. Frontend stores token in cookie (js-cookie)

3. Protected requests send:
     Authorization: Bearer <token>

4. authenticate_token middleware:
     ? Verifies JWT signature
     ? Checks token against revoked_tokens table
     ? Extracts user_id and location into req.body

5. POST /api/auth/logout
     ? Token inserted into revoked_tokens table
     ? Subsequent requests with this token are rejected
```

---

## Frontend Routes

| Path | Component | Protected |
|---|---|---|
| `/` or `/login` | Login | ? |
| `/signup` | Signup | ? |
| `/home` | Home | ? |
| `/dashboard` | Stock Dashboard | ? |
| `/addStock` | Add Stock Entry | ? |
| `/productdashboard` | Product Dashboard | ? |
| `/inventory` | Inventory / Available Stock | ? |
| `/model` | Model Dashboard | ? |
| `/stocks` | Stock Table View | ? |
| `/export` | Export Data | ? |
| `/import` | Import Data | ? |

---

## Notes

- **Soft deletes**: Most master data uses a `status` enum (`'0'` = inactive, `'1'` = active) rather than physical deletion, preserving referential integrity.
- **Token revocation**: Logout is implemented server-side. The token is stored in `revoked_tokens` and checked on every authenticated request.
- **Image serving**: Uploaded images are served statically at `http://localhost:5001/uploads/<path>`.
- **Production**: The live app is deployed at `https://app.bestshopsathy.in`.
