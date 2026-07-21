# API Reference

**Base URL:** `http://localhost:5000/api`

All responses follow this structure:
```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { },
  "pagination": { "page": 1, "limit": 12, "total": 50, "totalPages": 5 }
}
```

---

## Authentication

### POST /auth/register
Create a new customer account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "+90 555 123 4567"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "CUSTOMER" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### POST /auth/login
Authenticate and receive a JWT token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):** Same as register response.

---

### GET /auth/me
Get current authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

---

## Products

### GET /products
List all available products with optional filters.

**Query Parameters:**

| Param | Type | Description |
|---|---|---|
| `categoryId` | string | Filter by category |
| `search` | string | Search by name/description |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 12) |

---

### GET /products/featured
Get featured products for homepage display.

---

### GET /products/:id
Get a single product by ID.

---

### POST /products *(Admin)*
Create a new product.

**Headers:** `Authorization: Bearer <admin-token>`

**Body:**
```json
{
  "name": "Red Roses Bouquet",
  "description": "A beautiful arrangement of 12 red roses.",
  "price": 45.99,
  "stock": 20,
  "categoryId": "category-id-here",
  "isFeatured": true
}
```

---

### PUT /products/:id *(Admin)*
Update a product by ID.

---

### DELETE /products/:id *(Admin)*
Soft-delete a product (marks as unavailable, not removed from DB).

---

## Cart

> All cart endpoints require authentication.

### GET /cart
Get the current user's cart with items and total price.

### POST /cart/items
Add an item to the cart.

**Body:**
```json
{ "productId": "product-id", "quantity": 2 }
```

### PUT /cart/items/:itemId
Update quantity of a cart item.

**Body:**
```json
{ "quantity": 3 }
```

### DELETE /cart/items/:itemId
Remove a single item from the cart.

### DELETE /cart
Clear all items from the cart.

---

## Orders

### POST /orders
Place an order from the current cart.

**Body:**
```json
{
  "notes": "Please use eco-friendly packaging",
  "delivery": {
    "address": "123 Main Street",
    "city": "Ankara",
    "scheduledAt": "2026-07-25T14:00:00Z",
    "notes": "Ring the doorbell"
  }
}
```

### GET /orders
Get the current user's order history.

### GET /orders/:id
Get a single order by ID. Customers can only view their own orders.

### GET /orders/admin/all *(Admin)*
Get all orders. Optional `?status=PENDING` filter.

### PUT /orders/admin/:id/status *(Admin)*
Update an order's status.

**Body:**
```json
{ "status": "CONFIRMED" }
```

**Valid statuses:** `PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate record) |
| 500 | Internal Server Error |
