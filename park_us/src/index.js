// index.js (entry point)

// Import required modules
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";   // DB connection file
import parkingRoutes from "./routes/parkingRoutes.js"; // Parking routes

// Load environment variables first
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Add CORS and error handling middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Database connection
connectDB();

// Routes
app.use("/api/parking", parkingRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚗 Smart Parking API is running...");
});

// Port setup
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
