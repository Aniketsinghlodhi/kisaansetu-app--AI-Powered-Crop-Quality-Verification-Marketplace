# 📚 KisaanSetu-App - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require:
```
Header: Authorization: Bearer <JWT_TOKEN>
```

---

## Auth Endpoints

### 1. Signup
Create a new user account

**Endpoint**: `POST /auth/signup`

**No Auth Required**

**Request Body**:
```json
{
  "name": "John Farmer",
  "mobile": "9876543210",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer",
  "location": "Maharashtra"
}
```

**Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | User's full name |
| mobile | string | Yes | 10-digit mobile number (unique) |
| email | string | No | Email address (unique if provided) |
| password | string | Yes | Min 6 characters |
| role | string | Yes | "farmer" or "buyer" |
| location | string | Yes | State/location |

**Response** (Success):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "mobile": "9876543210",
    "email": "john@example.com",
    "role": "farmer",
    "location": "Maharashtra",
    "walletBalance": 1000,
    "rating": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "User with this mobile already exists"
}
```

**Status Codes**:
- `201` - User created successfully
- `400` - Validation error (missing fields, invalid format)
- `409` - User already exists

---

### 2. Login
Authenticate user and get JWT token

**Endpoint**: `POST /auth/login`

**No Auth Required**

**Request Body**:
```json
{
  "mobile": "9876543210",
  "password": "password123"
}
```

**Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| mobile | string | Yes | 10-digit mobile number |
| password | string | Yes | User's password |

**Response** (Success):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "mobile": "9876543210",
    "role": "farmer",
    "location": "Maharashtra",
    "walletBalance": 1000,
    "rating": 4.5
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Status Codes**:
- `200` - Login successful
- `400` - Validation error
- `401` - Invalid credentials

---

### 3. Get Profile
Get current user's profile

**Endpoint**: `GET /auth/profile`

**Auth Required**: Yes

**Response** (Success):
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Farmer",
    "mobile": "9876543210",
    "email": "john@example.com",
    "role": "farmer",
    "location": "Maharashtra",
    "walletBalance": 1000,
    "rating": 4.5,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized
- `404` - User not found

---

## Crop Endpoints

### 1. Get All Crops (Browse/Search)
Get all active crops with optional filters

**Endpoint**: `GET /crops`

**Auth Required**: No

**Query Parameters**:
```
?search=wheat&category=cereals&location=Punjab&minPrice=1000&maxPrice=5000
```

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| search | string | No | Search in crop name |
| category | string | No | Filter by crop category |
| location | string | No | Filter by farmer location |
| minPrice | number | No | Minimum base price |
| maxPrice | number | No | Maximum base price |
| status | string | No | "active", "sold", "expired" |

**Response**:
```json
{
  "success": true,
  "crops": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "cropName": "Wheat",
      "category": "cereals",
      "quantity": 100,
      "unit": "kg",
      "basePrice": 2500,
      "currentBid": 2600,
      "bidCount": 5,
      "aiGrade": "A",
      "qualityScore": 92,
      "status": "active",
      "location": "Punjab",
      "description": "High quality wheat",
      "imageUrl": "https://...",
      "farmerId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Farmer",
        "location": "Punjab",
        "rating": 4.5
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Status Codes**:
- `200` - Success
- `400` - Invalid query parameters

---

### 2. Get Crop by ID
Get detailed information about a specific crop

**Endpoint**: `GET /crops/:id`

**Auth Required**: No

**URL Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| id | string | Yes | MongoDB crop ID |

**Response**:
```json
{
  "success": true,
  "crop": {
    "_id": "507f1f77bcf86cd799439012",
    "cropName": "Wheat",
    "category": "cereals",
    "quantity": 100,
    "unit": "kg",
    "basePrice": 2500,
    "currentBid": 2600,
    "bidCount": 5,
    "aiGrade": "A",
    "qualityScore": 92,
    "status": "active",
    "location": "Punjab",
    "description": "High quality wheat",
    "imageUrl": "https://...",
    "farmerId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Farmer",
      "location": "Punjab",
      "rating": 4.5
    },
    "highestBidder": {
      "_id": "507f1f77bcf86cd799439015",
      "name": "Buyer Name"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `200` - Success
- `404` - Crop not found

---

### 3. Create Crop (Farmer)
Create a new crop listing

**Endpoint**: `POST /crops`

**Auth Required**: Yes (Farmer role only)

**Request Body**:
```json
{
  "cropName": "Wheat",
  "category": "cereals",
  "quantity": 100,
  "unit": "kg",
  "basePrice": 2500,
  "location": "Punjab",
  "description": "High quality wheat from Punjab",
  "imageUrl": "https://example.com/wheat.jpg"
}
```

**Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| cropName | string | Yes | Name of crop |
| category | string | Yes | See categories below |
| quantity | number | Yes | Quantity > 0 |
| unit | string | Yes | "kg", "ton", "quintal" |
| basePrice | number | Yes | Starting bid price |
| location | string | Yes | Harvest location |
| description | string | No | Detailed description |
| imageUrl | string | No | Crop image URL |

**Categories**:
```
cereals, pulses, oilseeds, spices, vegetables, 
fruits, dairy, flowers, others
```

**Response**:
```json
{
  "success": true,
  "crop": {
    "_id": "507f1f77bcf86cd799439012",
    "cropName": "Wheat",
    "category": "cereals",
    "quantity": 100,
    "unit": "kg",
    "basePrice": 2500,
    "currentBid": 0,
    "bidCount": 0,
    "aiGrade": "B",
    "qualityScore": 78,
    "status": "active",
    "location": "Punjab",
    "farmerId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes**:
- `201` - Crop created successfully
- `400` - Validation error
- `401` - Unauthorized or not farmer role

---

### 4. Update Crop (Farmer)
Update crop details

**Endpoint**: `PUT /crops/:id`

**Auth Required**: Yes (Farmer role only)

**Restrictions**: 
- Cannot update if bids exist (status must be active)
- Only farm owner can update

**Request Body** (All optional):
```json
{
  "quantity": 150,
  "basePrice": 2800,
  "description": "Updated description"
}
```

**Response**:
```json
{
  "success": true,
  "crop": {
    "_id": "507f1f77bcf86cd799439012",
    "cropName": "Wheat",
    "quantity": 150,
    "basePrice": 2800,
    "...": "..."
  }
}
```

**Status Codes**:
- `200` - Updated successfully
- `400` - Validation error or bids exist
- `401` - Unauthorized
- `404` - Crop not found

---

### 5. Delete Crop (Farmer)
Delete a crop listing

**Endpoint**: `DELETE /crops/:id`

**Auth Required**: Yes (Farmer role only)

**Restrictions**:
- Can only delete if status is "active"
- Only farm owner can delete
- Cannot delete if bids exist

**Response**:
```json
{
  "success": true,
  "message": "Crop deleted successfully"
}
```

**Status Codes**:
- `200` - Deleted successfully
- `400` - Cannot delete (has bids)
- `401` - Unauthorized
- `404` - Crop not found

---

### 6. Get Farmer's Crops (Farmer)
Get all crops listed by current farmer

**Endpoint**: `GET /crops/farmer`

**Auth Required**: Yes (Farmer role only)

**Query Parameters**:
```
?status=active&search=wheat
```

**Response**:
```json
{
  "success": true,
  "crops": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "cropName": "Wheat",
      "quantity": 100,
      "basePrice": 2500,
      "currentBid": 2600,
      "bidCount": 5,
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized

---

## Bid Endpoints

### 1. Place Bid (Buyer)
Place a bid on a crop

**Endpoint**: `POST /bids`

**Auth Required**: Yes (Buyer role only)

**Request Body**:
```json
{
  "cropId": "507f1f77bcf86cd799439012",
  "bidAmount": 2700
}
```

**Fields**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| cropId | string | Yes | Target crop ID |
| bidAmount | number | Yes | Bid amount >= currentBid + 1 |

**Validations**:
- Bid amount must be >= (currentBid + 1) OR >= basePrice
- Buyer wallet balance must be >= bidAmount
- Cannot bid on own crop

**Response**:
```json
{
  "success": true,
  "bid": {
    "_id": "607f1f77bcf86cd799439020",
    "cropId": "507f1f77bcf86cd799439012",
    "buyerId": "507f1f77bcf86cd799439016",
    "bidAmount": 2700,
    "status": "active",
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Bid amount must be at least 2601"
}
```

**Status Codes**:
- `201` - Bid placed successfully
- `400` - Validation error (amount too low, insufficient balance)
- `401` - Unauthorized or not buyer role
- `404` - Crop not found

---

### 2. Get My Bids (Buyer)
Get all bids placed by current buyer

**Endpoint**: `GET /bids/my/bids`

**Auth Required**: Yes (Buyer role only)

**Query Parameters**:
```
?status=active&sort=-bidAmount
```

| Parameter | Type | Notes |
|-----------|------|-------|
| status | string | "active", "won", "lost" |

**Response**:
```json
{
  "success": true,
  "bids": [
    {
      "_id": "607f1f77bcf86cd799439020",
      "cropId": {
        "_id": "507f1f77bcf86cd799439012",
        "cropName": "Wheat",
        "currentBid": 2700,
        "status": "active",
        "farmerId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "John Farmer"
        }
      },
      "bidAmount": 2700,
      "status": "active",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ],
  "count": 1
}
```

**Status Codes**:
- `200` - Success
- `401` - Unauthorized

---

### 3. Get Bids for Crop (Public)
Get all bids placed on a specific crop

**Endpoint**: `GET /bids/crop/:cropId`

**Auth Required**: No

**URL Parameters**:
| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| cropId | string | Yes | Target crop ID |

**Query Parameters**:
```
?sort=-bidAmount
```

**Response**:
```json
{
  "success": true,
  "bids": [
    {
      "_id": "607f1f77bcf86cd799439020",
      "buyerId": {
        "_id": "507f1f77bcf86cd799439016",
        "name": "Buyer Name"
      },
      "bidAmount": 2700,
      "status": "active",
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ],
  "count": 1
}
```

**Status Codes**:
- `200` - Success
- `404` - Crop not found

---

### 4. Get Highest Bid (Public)
Get the highest bid for a crop

**Endpoint**: `GET /bids/highest/:cropId`

**Auth Required**: No

**Response**:
```json
{
  "success": true,
  "bid": {
    "_id": "607f1f77bcf86cd799439020",
    "buyerId": {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Buyer Name"
    },
    "bidAmount": 2700,
    "createdAt": "2024-01-15T11:00:00Z"
  }
}
```

**Status Codes**:
- `200` - Success
- `404` - No bids found

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

| Status | Meaning | Common Causes |
|--------|---------|---------------|
| 200 | OK | Successful GET |
| 201 | Created | Successful POST (create) |
| 400 | Bad Request | Validation error, invalid input |
| 401 | Unauthorized | Missing/invalid token, wrong role |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (e.g., mobile exists) |
| 500 | Server Error | Unexpected error on backend |

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Farmer",
    "mobile": "9876543210",
    "password": "password123",
    "role": "farmer",
    "location": "Punjab"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "password": "password123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Crops
```bash
curl -X GET "http://localhost:5000/api/crops?category=cereals&location=Punjab"
```

### Create Crop (with token)
```bash
curl -X POST http://localhost:5000/api/crops \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "cropName": "Wheat",
    "category": "cereals",
    "quantity": 100,
    "unit": "kg",
    "basePrice": 2500,
    "location": "Punjab",
    "description": "High quality wheat"
  }'
```

### Place Bid (with token)
```bash
curl -X POST http://localhost:5000/api/bids \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "cropId": "CROP_ID_HERE",
    "bidAmount": 2700
  }'
```

---

## Rate Limiting

Currently no rate limiting. For production, consider:
- Limit signup to 5 per hour per IP
- Limit login to 10 per hour per user
- Limit API calls to 100 per hour per user

---

## Versioning

Current API Version: **v1**

Future versions will be available at:
- `/api/v2/...`
- `/api/v3/...`

---

**API Documentation v1.0 - Last Updated: 2024**
