# ShopSphere — E-Commerce Analytics Dashboard

> A full-stack analytics dashboard for tracking sales, customers, product performance, and AI-generated business insights.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Styling | Custom CSS with CSS Variables |
| Fonts | Space Mono + DM Sans (Google Fonts) |

---

## Features

- **Overview Dashboard** — KPI cards (revenue, orders, customers, AOV), monthly revenue line chart, order status pie chart, category bar chart, payment method breakdown
- **Analytics Page** — Daily 30-day trend (area chart), monthly order volume, top cities by revenue
- **Products Page** — Top 10 products table with revenue/units sold, low stock alert panel
- **Orders Page** — Paginated orders table with status filter, payment method, customer tier badge
- **Customers Page** — Customer stats, paginated customer list with premium member tagging
- **AI Insights Page** — Automated business insights derived from sales data (revenue trends, top category, cancellation rate analysis, recommendations)

---

## Project Structure

```
ShopSphere/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   ├── db/
│   │   ├── connection.js      # PostgreSQL pool connection
│   │   ├── schema.sql         # Tables, indexes, views (run first)
│   │   └── seed.js            # Seeder with 250 realistic orders
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── customers.js
│   └── controllers/
│       ├── analyticsController.js   # Complex SQL queries + insights engine
│       ├── productsController.js
│       ├── ordersController.js
│       └── customersController.js
│
└── frontend/
    ├── public/index.html
    ├── package.json
    └── src/
        ├── App.js / App.css
        ├── index.js
        ├── utils/
        │   ├── api.js          # Axios instance + endpoint wrappers
        │   └── format.js       # Currency, date, number formatters
        ├── hooks/
        │   └── useFetch.js     # Generic data fetching hook
        └── components/
            ├── layout/
            │   ├── Sidebar.js / Sidebar.css
            │   └── StatCard.js / StatCard.css
            └── pages/
                ├── Overview.js / Overview.css
                ├── Analytics.js
                ├── Products.js
                ├── Orders.js
                ├── Customers.js
                └── Insights.js / Insights.css
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+

### 1. Database Setup

```bash
# Open psql and run the schema
psql -U postgres -f backend/db/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and fill in your PostgreSQL credentials

# Seed the database with sample data (250 orders, 20 customers, 27 products)
npm run seed

# Start the backend server
npm run dev
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
# App runs on http://localhost:3000
```

---

## API Endpoints

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/overview` | KPI summary stats |
| GET | `/api/analytics/monthly-revenue` | 12-month revenue trend |
| GET | `/api/analytics/category-sales` | Sales by product category |
| GET | `/api/analytics/order-status` | Order status distribution |
| GET | `/api/analytics/payment-methods` | Payment method breakdown |
| GET | `/api/analytics/top-cities` | Top 10 cities by revenue |
| GET | `/api/analytics/daily-trend` | Daily data for last 30 days |
| GET | `/api/analytics/ai-insights` | Business insights from data |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products with pagination |
| GET | `/api/products/top` | Top 10 by revenue |
| GET | `/api/products/low-stock` | Products below 100 units |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Paginated orders (`?status=delivered&page=1`) |
| GET | `/api/orders/:id` | Single order with items |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customers` | Paginated customer list |
| GET | `/api/customers/stats` | Customer summary stats |
| GET | `/api/customers/top` | Top 10 by spend |

---

## Key SQL Concepts Used

- `JOIN` across 5 tables (orders, order_items, products, categories, customers)
- `GROUP BY` with aggregate functions (`SUM`, `COUNT`, `AVG`, `ROUND`)
- **Window Functions**: `COUNT(*) OVER ()` for percentage calculation
- `DATE_TRUNC` for monthly/daily grouping
- **CTEs** available in views (`monthly_revenue`, `product_performance`)
- `GENERATED ALWAYS AS` computed column (`subtotal` in order_items)
- **Indexes** on all foreign keys and frequently filtered columns
- **Subqueries** in the overview endpoint

---

## Resume Description (as provided)

> Built a full-stack e-commerce analytics dashboard for tracking sales, customer activity, and product performance. Developed interactive visualizations and database-driven reporting features using React, Express.js, and PostgreSQL. Implemented AI-powered sales trend analysis and recommendation insights for business optimization.

---

## Deployment (Free Tier)

| Service | Use |
|---------|-----|
| **Railway** | Backend (Node.js) + PostgreSQL |
| **Vercel** | Frontend (React) |
| **Render** | Alternative for both |

Set `REACT_APP_API_URL` in Vercel to your Railway backend URL.

---

## Author

Built as a placement project — ShopSphere v1.0.0
