# InvoiceAutomationWithOAuth Backend

This repository contains the backend API server for the Invoice Automation system integrated with OAuth authentication.

### Features:
- Google OAuth integration for user authentication.
- REST API endpoints for retrieving invoice details and triggering automation.
- Integration with Zapier for automating past-due invoice reminders.

### Technologies Used:
- Node.js and Express.js for backend development.
- Passport.js for OAuth authentication.
- Axios for making HTTP requests.
- Express-session for managing user sessions.
- Jest and Supertest for testing.

### Setup Instructions:
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set the environment variables as described in `.env.example`.
4. Start the server using `npm start`.
5. The server will run on http://localhost:5000 by default.

### Deployment:
- Deploy this server on platforms like Heroku, AWS EC2, or DigitalOcean.
- Ensure to configure environment variables for production deployments.
