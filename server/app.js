const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const passportSetup = require('./passport');
const session = require('express-session');

/* ENVIRONMENT SETUP */
require('dotenv').config();
/* DATABASE SETUP */
require('./config/database');

const app = express();

/* MIDDLEWARES */
app.use(express.json());
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));
// app.use(
//     cookieSession({
//         name: 'session',
//         keys: ['task'],
//         maxAge: 24*60*60*1000
//     })
// );
app.use(session({
    secret: 'task',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

/* ROUTES */
/* AUTH ROUTE */
const authRoutes = require('./routes/auth'); 
app.use('/auth', authRoutes);

/* PRODUCT ROUTE */
const productRoutes = require('./routes/product');
app.use('/api', productRoutes);

/* ERROR HANDLING MIDDLEWARE */
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

/* RUN SERVER */
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is listening on port http://localhost:${port}`));
