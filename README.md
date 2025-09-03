# TradeZy - B2B Wholesale Marketplace

A comprehensive B2B e-commerce platform connecting wholesale sellers with verified business buyers. Built with the MERN stack and TypeScript.

## Features

- **Multi-Role System**: Admin, Seller, and Buyer roles with specific permissions
- **Buyer Verification**: Admin approval required for buyers to access wholesale prices
- **Product Management**: Comprehensive product catalog with variants and inventory tracking
- **RFQ System**: Request for Quote functionality for bulk orders
- **Seller Storefronts**: Customizable storefronts for sellers
- **Order Management**: Complete order lifecycle management
- **Secure Authentication**: JWT-based authentication with refresh tokens

## Tech Stack

- **Frontend**: React 18, TypeScript, Redux Toolkit, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Authentication**: JWT with refresh tokens
- **File Storage**: AWS S3 (configurable)
- **Payment**: Stripe Connect (ready for integration)

## Project Structure

```
tradezy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Feature modules
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utilities
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities
└── shared/               # Shared types/constants
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Update the values with your configuration

4. Start the development servers:
   ```bash
   npm run dev
   ```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start backend server only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies

## API Documentation

The API is organized into the following main endpoints:

- `/api/auth` - Authentication endpoints
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/rfqs` - Request for Quote management
- `/api/users` - User management
- `/api/categories` - Category management
- `/api/stores` - Storefront management

## User Roles

1. **Admin**
   - Full system access
   - User approval/management
   - Platform settings

2. **Seller**
   - Product management
   - Inventory tracking
   - Order fulfillment
   - RFQ responses
   - Storefront customization

3. **Buyer**
   - View wholesale prices (after approval)
   - Place orders
   - Submit RFQs
   - Manage suppliers

## License

ISC