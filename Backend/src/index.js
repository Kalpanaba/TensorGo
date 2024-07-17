// const express = require('express');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const session = require('express-session');

// /*
// Notes:
// passport: This is the Passport library, which helps in handling authentication.
// GoogleStrategy: This is the specific strategy from Passport for Google OAuth 2.0.
// session: This is the express-session library, which is used to manage user sessions.

// */

// const app = express();
// app.use(express.json());
// app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// /*
// Notes->
// session: Configures session management:
// secret: A key used to sign the session ID cookie.
// resave: Forces the session to be saved back to the session store, even if it wasn’t modified during the request.
// saveUninitialized: Forces a session that is “uninitialized” to be saved to the store.

// passport.initialize(): Initializes Passport for the application.
// passport.session(): Middleware to handle persistent login sessions.
// */

// // Configure Google OAuth strategy
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     // Here you would normally save the user to your database
//     return cb(null, { profile: profile, accessToken: accessToken });
//   }
// ));

// /*
// clientID: Your Google Client ID (stored in environment variables).
// clientSecret: Your Google Client Secret (stored in environment variables).
// callbackURL: The URL to which Google will redirect users after they have authenticated (stored in environment variables).

// function(accessToken, refreshToken, profile, cb): A callback function that is called after successful authentication:
// accessToken: The token to access Google APIs on behalf of the user.
// refreshToken: A token used to obtain a new access token.
// profile: Information about the authenticated user.
// cb: A callback function that passes control to the next middleware

// */

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// /*
// serializeUser: Determines which data from the user object should be stored in the session. Here, we are storing the entire user object.
// deserializeUser: Extracts the user data from the session. This allows us to attach the user information to the req.user object.

// */

// // Google OAuth endpoints
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(process.env.FRONTEND_URL);  // Redirect to the frontend after login
// });

// // API to get invoice details (mock data)
// app.get('/api/invoices', (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.status(401).send('You need to log in');
//   }
//   // Example invoice data
//   res.json([{ id: 1, amount: 1000, dueDate: '2024-07-31', recipient: 'Customer A' }]);
// });

// async function sendInvoiceToZapier(invoice) {
//     const zapierWebhookURL = process.env.ZAPIER_WEBHOOK_URL;
//     try {
//       const response = await axios.post(zapierWebhookURL, invoice);
//       console.log(`Zapier response: ${response.status}`);
//     } catch (error) {
//       console.error(`Error sending data to Zapier: ${error}`);
//     }
//   }
  
//   app.get('/api/check-invoices', async (req, res) => {
//     if (!req.isAuthenticated()) {
//       return res.status(401).send('You need to log in');
//     }
  
//     //by checking for a particular condition, like "retrive a list of unpaid invoices, we retrived some invoices records from DB"
//     const invoices = [
//       { id: 1, amount: 1000, dueDate: '2024-07-31', recipient: 'Customer A' },
//       { id: 2, amount: 1500, dueDate: '2024-06-30', recipient: 'Customer B' },
//     ];
  
//     const now = new Date();
  
//     for (const invoice of invoices) {
//       const dueDate = new Date(invoice.dueDate);
//       //if invoice is unpaid till today's date, then we need to use zapier to send a reminder to the client, so that he can pay us back
//       if (dueDate < now) {
//         await sendInvoiceToZapier(invoice);
//       }
//     }
  
//     res.send('Checked invoices for past due.');
//   });
  

// // Starting the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
