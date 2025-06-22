# 📚 ChainMove API Reference

Welcome to the ChainMove API documentation. This reference provides detailed information about our RESTful API endpoints, request/response formats, and authentication mechanisms.

## 🔐 Authentication

ChainMove API uses JWT (JSON Web Tokens) for authentication. Include the JWT token in the `Authorization` header of your requests.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Base URL

```
https://api.chainmove.io/v1
```

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Response Headers**:
  - `X-RateLimit-Limit`: Maximum number of requests allowed
  - `X-RateLimit-Remaining`: Remaining number of requests
  - `X-RateLimit-Reset`: Time when the rate limit resets (UTC epoch seconds)

## Error Handling

All error responses follow this format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message",
    "details": {
      "field_name": "Additional error details"
    }
  }
}
```

### Common HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## API Endpoints

### Authentication

#### `POST /auth/login`

Authenticate a user and retrieve an access token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "driver",
    "wallet_address": "0x1234..."
  }
}
```

### Users

#### `GET /users/me`

Get the authenticated user's profile.

**Response:**

```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "driver",
  "wallet_address": "0x1234...",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

### Vehicles

#### `GET /vehicles`

List all available vehicles with optional filters.

**Query Parameters:**
- `status` - Filter by status (available, financed, maintenance)
- `make` - Filter by vehicle make
- `model` - Filter by vehicle model
- `year` - Filter by manufacturing year
- `limit` - Number of items per page (default: 10)
- `page` - Page number (default: 1)

**Response:**

```json
{
  "data": [
    {
      "id": "veh_123",
      "make": "Toyota",
      "model": "Corolla",
      "year": 2022,
      "vin": "JT2BF22K1W0123456",
      "status": "available",
      "price": 25000,
      "token_id": "123",
      "token_address": "0x1234...",
      "image_url": "https://..."
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "total_pages": 1
  }
}
```

### Investments

#### `POST /investments`

Create a new investment in a vehicle.

**Request Body:**

```json
{
  "vehicle_id": "veh_123",
  "amount": 5000,
  "wallet_address": "0x1234...",
  "terms_accepted": true
}
```

**Response:**

```json
{
  "id": "inv_123",
  "vehicle_id": "veh_123",
  "investor_id": "user_123",
  "amount": 5000,
  "status": "pending",
  "transaction_hash": "0x1234...",
  "created_at": "2023-01-01T00:00:00Z"
}
```

## WebSocket API

ChainMove provides real-time updates through WebSocket connections.

**Connection URL:**
```
wss://api.chainmove.io/v1/ws
```

### Events

#### Subscribe to Updates

```json
{
  "action": "subscribe",
  "channel": "vehicle_updates",
  "vehicle_id": "veh_123"
}
```

#### Unsubscribe from Updates

```json
{
  "action": "unsubscribe",
  "channel": "vehicle_updates",
  "vehicle_id": "veh_123"
}
```

## SDKs

### JavaScript/TypeScript

```javascript
import ChainMove from '@chainmove/sdk';

const client = new ChainMove({
  apiKey: 'your_api_key',
  network: 'mainnet' // or 'testnet'
});

// Example: Get vehicle details
const vehicle = await client.vehicles.get('veh_123');
```

## Support

For API support, please contact [support@chainmove.io](mailto:support@chainmove.io) or join our [Discord community](https://discord.gg/your-invite).
