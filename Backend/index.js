const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const Invoice = require('./models/Invoice'); 
const populateInvoices = require('./populateInvoices'); 

dotenv.config();

// Enable CORS
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    const invoices = [
      { userId: '10982', amount: 200, dueDate: new Date('2024-07-10'), recipient: 'kalpanabammidi123@gmail.com', isPaid: false },
      { userId: '10983', amount: 150, dueDate: new Date('2024-07-12'), recipient: 'kalpanabammidi123@gmail.com', isPaid: false },
      { userId: '10984', amount: 100, dueDate: new Date('2024-07-15'), recipient: 'kalpanabammidi123@gmail.com', isPaid: false },
      { userId: '10985', amount: 250, dueDate: new Date('2024-07-01'), recipient: 'kalpanabammidi123@gmail.com', isPaid: false },
      { userId: '10986', amount: 300, dueDate: new Date('2024-07-05'), recipient: 'kalpanabammidi123@gmail.com', isPaid: false }
    ];

    const insertedInvoices = await Promise.all(invoices.map(async (invoice) => {
      // if the invoice already exists in the database
      const existingInvoice = await Invoice.findOne({ 
        userId: invoice.userId,
        amount: invoice.amount,
        dueDate: invoice.dueDate,
        recipient: invoice.recipient,
        isPaid: invoice.isPaid
      });

      //invoice does not exist, insert it
      if (!existingInvoice) {
        return Invoice.create(invoice);
      } else {
        console.log(`Invoice already exists for userId: ${invoice.userId}, skipping insertion.`);
        return null; 
      }
    }));

    const filteredInsertedInvoices = insertedInvoices.filter(invoice => invoice !== null); 

    console.log(`${filteredInsertedInvoices.length} invoices populated.`);
    process.exit(0);
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    
  },
  function(accessToken, refreshToken, profile, cb) {
    
    return cb(null, { profile: profile, accessToken: accessToken });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Google OAuth endpoints
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(process.env.FRONTEND_URL);  
});



app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Session destruction failed', error: err });
      }
      res.clearCookie('connect.sid'); 
      res.json({ message: 'Successfully logged out' });
    });
  });
});


app.get('/api/invoices', async (req, res) => {
  try {
    // logic to fetch invoices
    const invoices = await Invoice.find({}); 
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).send('Error fetching invoices');
  }
});


app.get('/api/check-invoices', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('You need to log in');
  }

  try {
    // logic to fetch and process invoices
   
    const recipient = req.user.profile.emails[0].value;
   
    const now = new Date();
    console.log('hey',Invoice.find({}));
    
    const invoices = await Invoice.find({recipient: recipient,dueDate: { $lt: now },isPaid: false});
    
    for (const invoice of invoices) {
      await mailIntegration(invoice);
    }

    res.send('Checked invoices for past due.');
  } catch (error) {
    console.error('Error checking invoices:', error);
    res.status(500).send('Error checking invoices');
  }
});


async function mailIntegration(invoice) {
  const zapierWebhookURL = process.env.ZAPIER_WEBHOOK_URL;
  console.log("URL", zapierWebhookURL);
  console.log(invoice);
  try {
    const response = await axios.post(zapierWebhookURL, invoice);
    console.log(`Zapier response: ${response.status}`);
  } catch (error) {
    console.error(`Error sending data to Zapier: ${error}`);
  }
}

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
