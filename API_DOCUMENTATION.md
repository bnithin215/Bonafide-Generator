# 📡 API Documentation - Bonafide Certificate Generator

Complete API reference for the Bonafide Certificate Generator backend.

## Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Token). Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

---

## 🔐 Authentication Endpoints

### 1. Register New User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Access:** Public

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rollNumber": "21R11A05E1",
  "department": "CSE",
  "course": "B.Tech",
  "fatherName": "Mr. Doe",
  "dateOfBirth": "2003-05-15"
}
```

**Validation Rules:**
- `name`: Required, non-empty string
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters
- Other fields: Optional

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "rollNumber": "21R11A05E1",
    "department": "CSE"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login User

Authenticate a user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "rollNumber": "21R11A05E1",
    "department": "CSE",
    "course": "B.Tech"
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 3. Get Current User

Get the currently authenticated user's information.

**Endpoint:** `GET /api/auth/me`

**Access:** Private (requires JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "rollNumber": "21R11A05E1",
    "department": "CSE",
    "course": "B.Tech",
    "fatherName": "Mr. Doe",
    "dateOfBirth": "2003-05-15"
  }
}
```

---

## 📄 Bonafide Request Endpoints

### 1. Submit Bonafide Request

Submit a new bonafide certificate request.

**Endpoint:** `POST /api/bonafide/request`

**Access:** Private (User)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentName": "John Doe",
  "rollNumber": "21R11A05E1",
  "fatherName": "Mr. Doe",
  "department": "Computer Science",
  "course": "B.Tech",
  "academicYear": "2021-2025",
  "dateOfBirth": "2003-05-15",
  "purpose": "Bank Loan",
  "conduct": "Good"
}
```

**Validation Rules:**
All fields are required and must be non-empty strings.

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Bonafide request submitted successfully",
  "request": {
    "id": "request_id_123",
    "userId": "user_id_123",
    "studentName": "John Doe",
    "rollNumber": "21R11A05E1",
    "status": "pending",
    "createdAt": "2025-11-18T10:30:00Z",
    ...
  }
}
```

---

### 2. Get User's Requests

Get all bonafide requests for the logged-in user.

**Endpoint:** `GET /api/bonafide/my-requests`

**Access:** Private (User)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "requests": [
    {
      "id": "request_id_123",
      "userId": "user_id_123",
      "studentName": "John Doe",
      "rollNumber": "21R11A05E1",
      "status": "approved",
      "approvedBy": "admin_id_456",
      "approverInfo": {
        "name": "Admin User",
        "email": "admin@tkrcollege.edu"
      },
      "createdAt": "2025-11-18T10:30:00Z",
      ...
    }
  ]
}
```

---

### 3. Get All Requests (Admin Only)

Get all bonafide requests in the system. Optionally filter by status.

**Endpoint:** `GET /api/bonafide/all-requests?status=pending`

**Access:** Private (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `approved`, `rejected`)

**Success Response:** `200 OK`
```json
{
  "success": true,
  "count": 5,
  "requests": [
    {
      "id": "request_id_123",
      "userId": "user_id_123",
      "userInfo": {
        "name": "John Doe",
        "email": "john@example.com",
        "rollNumber": "21R11A05E1",
        "department": "CSE"
      },
      "studentName": "John Doe",
      "status": "pending",
      "createdAt": "2025-11-18T10:30:00Z",
      ...
    }
  ]
}
```

---

### 4. Get Single Request

Get details of a specific bonafide request.

**Endpoint:** `GET /api/bonafide/request/:id`

**Access:** Private (Owner or Admin)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Request ID

**Success Response:** `200 OK`
```json
{
  "success": true,
  "request": {
    "id": "request_id_123",
    "userId": "user_id_123",
    "userInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "rollNumber": "21R11A05E1",
      "department": "CSE"
    },
    "studentName": "John Doe",
    "rollNumber": "21R11A05E1",
    "status": "approved",
    "approvedBy": "admin_id_456",
    "approverInfo": {
      "name": "Admin User",
      "email": "admin@tkrcollege.edu"
    },
    ...
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Request not found"
}
```

**Error Response:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Not authorized to access this request"
}
```

---

### 5. Approve Request

Approve a bonafide certificate request.

**Endpoint:** `PUT /api/bonafide/approve/:id`

**Access:** Private (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Request ID

**Request Body:**
```json
{
  "adminNotes": "Approved for bank loan purpose"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Request approved successfully",
  "request": {
    "id": "request_id_123",
    "status": "approved",
    "approvedBy": "admin_id_456",
    "approvedAt": "2025-11-18T15:45:00Z",
    "adminNotes": "Approved for bank loan purpose",
    ...
  }
}
```

---

### 6. Reject Request

Reject a bonafide certificate request.

**Endpoint:** `PUT /api/bonafide/reject/:id`

**Access:** Private (Admin only)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**URL Parameters:**
- `id`: Request ID

**Request Body:**
```json
{
  "adminNotes": "Incomplete information provided"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Request rejected",
  "request": {
    "id": "request_id_123",
    "status": "rejected",
    "approvedBy": "admin_id_456",
    "adminNotes": "Incomplete information provided",
    ...
  }
}
```

---

### 7. Delete Request

Delete a bonafide certificate request.

**Endpoint:** `DELETE /api/bonafide/request/:id`

**Access:** Private (Owner or Admin)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id`: Request ID

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

**Error Response:** `403 Forbidden`
```json
{
  "success": false,
  "message": "Not authorized to delete this request"
}
```

---

## 🔑 Authentication & Authorization

### JWT Token Structure

```json
{
  "id": "user_id_123",
  "iat": 1700308800,
  "exp": 1700913600
}
```

### Token Expiration

- Default: 7 days
- Configurable via `JWT_EXPIRE` environment variable

### Role-Based Access

- **Public**: Anyone can access
- **User**: Authenticated users only
- **Admin**: Admin users only

---

## ⚠️ Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Validation Error) |
| 401 | Unauthorized (Invalid/Missing Token) |
| 403 | Forbidden (Insufficient Permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 📝 Examples

### cURL Examples

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Submit Request**
```bash
curl -X POST http://localhost:5000/api/bonafide/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "rollNumber": "21R11A05E1",
    "fatherName": "Mr. Doe",
    "department": "CSE",
    "course": "B.Tech",
    "academicYear": "2021-2025",
    "dateOfBirth": "2003-05-15",
    "purpose": "Bank Loan",
    "conduct": "Good"
  }'
```

### JavaScript/Fetch Examples

**Login**
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;
```

**Get User Requests**
```javascript
const response = await fetch('http://localhost:5000/api/bonafide/my-requests', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.requests);
```

---

## 🔒 Security Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** (httpOnly cookies or secure storage)
3. **Never expose tokens** in URLs or logs
4. **Implement rate limiting** to prevent abuse
5. **Validate all inputs** on both client and server
6. **Use strong passwords** (enforce minimum requirements)
7. **Rotate JWT secrets** periodically

---

## 📞 Support

For API-related issues:
- Email: admin@tkrcollege.edu
- GitHub Issues: [Create an issue](https://github.com/bnithin215/Bonafide-Generator/issues)

---

Last Updated: November 2025
