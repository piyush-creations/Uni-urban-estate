import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session'; // Import session middleware

import authRoute from './routes/auth.route.js';
import propertyRoutes from './routes/property.route.js';
import featured from './Featured/properties.js';
import profileRoutes from './routes/profile.route.js';
import recomms from './controllers/recommendations.controller.js';

const app = express();

// Enable CORS with credentials support
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configure express-session
app.use(session({
    secret: process.env.SESSION_SECRET,  // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    },
}));

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    // Log session data for debugging
    next();
});

app.use((req, res, next) => {
    if (!req.session.isloggedIn) {
        req.session.isloggedIn = false; // Initialize loggedIn status
        req.session.visitedProperties = [];
    }
    // req.session.user = null; // Initialize user session
    next();
});


// Routes
app.use("/api/auth", authRoute);
app.use("/api/property", propertyRoutes);
app.use("/api/featured", featured);
app.use("/api/recommendations", recomms);
app.use("/api/profile", profileRoutes);
app.use("/images/uploads", express.static("uploads"));

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
