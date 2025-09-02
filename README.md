# Square Save Card Starter

A Node.js + Express application that demonstrates how to implement Square's Web Payments SDK with OAuth for marketplace sellers to save customer payment cards on file.

## Features

- **OAuth Integration**: Connect marketplace sellers to Square
- **Customer Management**: Search and create customers
- **Card Storage**: Save payment cards securely using Square's Web Payments SDK
- **Location Management**: Handle multiple business locations
- **Sandbox Support**: Test with Square's sandbox environment

## Prerequisites

- Node.js 18+ 
- Square Developer Account
- Square Application with OAuth enabled

## Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `env.example` to `.env`
   - Fill in your Square application credentials:
     ```bash
     SQUARE_ENV=sandbox
     SQUARE_APP_ID=your_app_id_here
     SQUARE_APP_SECRET=your_app_secret_here
     SQUARE_REDIRECT_URL=http://localhost:3000/oauth/callback
     PORT=3000
     ```

3. **Square Developer Console Setup**
   - Create a new application in [Square Developer Console](https://developer.squareup.com/)
   - Enable OAuth
   - Set redirect URL to `http://localhost:3000/oauth/callback`
   - Ensure scopes: `CUSTOMERS_READ`, `CUSTOMERS_WRITE`, `PAYMENTS_WRITE`, `PAYMENTS_READ`

4. **Update HTML with Your App ID**
   - In `public/index.html`, replace `<YOUR_SANDBOX_APP_ID>` with your actual sandbox app ID
   - For production, also update `<YOUR_PRODUCTION_APP_ID>`

## Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Usage Flow

1. **Connect Seller**: Visit `/connect` to start OAuth flow
2. **Authorize**: Approve permissions in Square
3. **Return**: You'll be redirected back with a `merchant_id`
4. **Select Location**: Choose from available business locations
5. **Manage Customers**: Search existing or create new customers
6. **Save Card**: Enter card details and save to customer profile

## Testing

Use Square's sandbox test cards:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **ZIP**: 10003 (must match in both tokenize and CreateCard calls)

## API Endpoints

- `GET /connect` - Start OAuth flow
- `GET /oauth/callback` - OAuth callback handler
- `GET /api/locations` - List seller locations
- `POST /api/customers/search` - Search customers by email/phone
- `POST /api/customers` - Create new customer
- `POST /api/cards` - Save card on file

## Architecture

- **Express Server**: RESTful API endpoints
- **Square SDK**: Official Node.js SDK for Square APIs
- **Web Payments SDK**: Client-side card tokenization
- **OAuth Flow**: Secure seller authentication
- **In-Memory Storage**: Simple token storage (replace with database in production)

## Production Considerations

- Replace in-memory `sellers` Map with persistent database
- Implement refresh token handling
- Use HTTPS and real domain for redirect URLs
- Switch to production Square SDK CDN
- Add proper error handling and logging
- Implement rate limiting and security headers

## Troubleshooting

- **OAuth Errors**: Verify app credentials and redirect URL
- **Card Tokenization**: Ensure billing address ZIP matches between tokenize and CreateCard
- **Location Issues**: Check if seller has active locations
- **Customer Search**: Use exact email/phone matches

## License

This project is for educational purposes. Refer to Square's [Terms of Service](https://squareup.com/legal/ua) for production use.
