# ⚙️ Configuration Guide

This guide covers all configuration options available in the ChainMove platform, including environment variables, feature flags, and customization options.

## Environment Variables

### Frontend Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3001` | Base URL for API requests |
| `NEXT_PUBLIC_CHAIN_ID` | Yes | `80001` | Default blockchain network ID |
| `NEXT_PUBLIC_RPC_URL` | Yes | `https://rpc-mumbai.maticvigil.com` | RPC endpoint for blockchain access |
| `NEXT_PUBLIC_IPFS_GATEWAY` | No | `https://ipfs.io/ipfs/` | IPFS gateway URL |
| `NEXT_PUBLIC_GA_TRACKING_ID` | No | - | Google Analytics tracking ID |
| `NEXT_PUBLIC_SENTRY_DSN` | No | - | Sentry DSN for error tracking |

### Backend Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3001` | Port for the backend server |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Secret for JWT token signing |
| `JWT_EXPIRES_IN` | No | `30d` | JWT token expiration time |
| `WEB3_PROVIDER` | Yes | - | Web3 provider URL |
| `PRIVATE_KEY` | Yes | - | Wallet private key for blockchain transactions |
| `IPFS_API_KEY` | No | - | API key for IPFS service |
| `IPFS_API_SECRET` | No | - | API secret for IPFS service |
| `EMAIL_SERVICE` | No | - | Email service provider |
| `EMAIL_USER` | No | - | Email service username |
| `EMAIL_PASS` | No | - | Email service password |

### Smart Contract Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MUMBAI_RPC_URL` | Yes | - | Mumbai testnet RPC URL |
| `POLYGON_RPC_URL` | No | - | Polygon mainnet RPC URL |
| `PRIVATE_KEY` | Yes | - | Wallet private key for deployment |
| `POLYGONSCAN_API_KEY` | No | - | API key for contract verification |
| `REPORT_GAS` | No | `false` | Enable gas usage reporting |

## Feature Flags

ChainMove supports the following feature flags that can be toggled in the configuration:

```json
{
  "features": {
    "enablePayments": true,
    "enableInvestments": true,
    "enableGovernance": false,
    "maintenanceMode": false,
    "allowRegistrations": true,
    "enableAnalytics": true,
    "enableNotifications": true
  }
}
```

## Customization

### Branding

Customize the look and feel of your ChainMove instance by modifying these values:

```css
:root {
  --primary-color: #4F46E5;
  --secondary-color: #10B981;
  --accent-color: #F59E0B;
  --text-color: #1F2937;
  --background-color: #FFFFFF;
  --success-color: #10B981;
  --warning-color: #F59E0B;
  --error-color: #EF4444;
  --border-radius: 0.5rem;
  --box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

### Localization

ChainMove supports multiple languages. To add a new language:

1. Create a new JSON file in `/locales` (e.g., `es.json`)
2. Add your translations following this structure:

```json
{
  "common": {
    "welcome": "Bienvenido a ChainMove",
    "login": "Iniciar sesión",
    "signup": "Registrarse"
  },
  "navigation": {
    "dashboard": "Panel de control",
    "vehicles": "Vehículos",
    "investments": "Inversiones"
  }
}
```

3. Update the `i18n` configuration in `next.config.js`

## Security Configuration

### Rate Limiting

Configure rate limiting in the backend:

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/', apiLimiter);
```

### CORS Configuration

Configure CORS in the backend:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://app.yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
```

## Monitoring and Logging

### Sentry Configuration

To enable error tracking with Sentry:

1. Set `NEXT_PUBLIC_SENTRY_DSN` in your environment variables
2. Configure Sentry in your frontend and backend

### Logging Levels

Configure logging levels in the backend:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Advanced Configuration

### Database Indexing

For optimal performance, ensure these indexes are created:

```javascript
// In your backend models
UserSchema.index({ email: 1 }, { unique: true });
VehicleSchema.index({ status: 1, price: 1 });
InvestmentSchema.index({ userId: 1, status: 1 });
```

### Cache Configuration

Configure Redis caching:

```javascript
const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
```

## Environment Configuration Files

### Development (`.env.development`)

```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
MONGODB_URI=mongodb://localhost:27017/chainmove-dev
JWT_SECRET=dev_secret_key_123
```

### Production (`.env.production`)

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.chainmove.io
MONGODB_URI=mongodb+srv://user:password@cluster0.mongodb.net/chainmove-prod
JWT_SECRET=your_secure_production_secret
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure `.env` files are in the correct directory
   - Restart your development server after changing variables
   - Check for typos in variable names

2. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure network access is allowed

3. **Blockchain Connection Problems**
   - Verify RPC URL is correct
   - Check network status
   - Ensure wallet has sufficient funds for transactions

## Next Steps

- [API Documentation](../technical/developer-guide.md)

---

*Last Updated: June 2025*
