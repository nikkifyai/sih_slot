# 🅿️ Smart Parking System - Technical Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technical Implementation](#technical-implementation)
3. [API Documentation](#api-documentation)
4. [Database Design](#database-design)
5. [Frontend Implementation](#frontend-implementation)
6. [Security Measures](#security-measures)
7. [Configuration Guide](#configuration-guide)
8. [Development Guide](#development-guide)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

## System Architecture

### Project Structure
```
park_us/
├── src/
│   ├── index.js              # Application entry point
│   ├── config/              
│   │   └── db.js            # Database configuration
│   ├── controllers/
│   │   └── parkingController.js  # Business logic
│   ├── models/
│   │   └── ParkingSlot.js   # Data models
│   └── routes/
│       └── parkingRoutes.js  # API routes
├── test-new.html            # Testing interface
├── package.json             # Dependencies
└── .env                     # Configuration
```

### Component Overview
1. **Backend Server (index.js)**
   ```javascript
   import express from 'express';
   import cors from 'cors';
   import parkingRoutes from './routes/parkingRoutes.js';
   
   // Server configuration
   const app = express();
   app.use(cors());
   app.use(express.json());
   
   // Route mounting
   app.use('/api/parking', parkingRoutes);
   ```

2. **Database Connection (db.js)**
   ```javascript
   import mongoose from 'mongoose';
   
   const connectDB = async () => {
     try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log(`✅ MongoDB Connected`);
     } catch (error) {
       console.error(`❌ Error: ${error.message}`);
       process.exit(1);
     }
   };
   ```

## Technical Implementation

### Backend Components

#### 1. Parking Controller (parkingController.js)
```javascript
// Key Functions:
- getAllSlots(): Retrieve all parking slots
- addSlot(): Create new parking slot
- bookSlot(): Handle slot booking with user data
- updateSlotStatus(): Manage slot status changes
```

#### 2. Data Models (ParkingSlot.js)
```javascript
const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: Number,
    required: true,
    unique: true
  },
  isOccupied: Boolean,
  vehicleNumber: String,
  bookedAt: Date,
  userData: {
    name: String,
    phoneNumber: String,
    email: String,
    vehicleType: {
      type: String,
      enum: ['car', 'bike', 'truck']
    }
  },
  expectedDuration: Number,
  bookingStatus: String
});
```

### Frontend Components

#### 1. Real-time Updates (test-new.html)
```javascript
async function updateLiveView() {
  try {
    const response = await fetch(`${baseUrl}/api/parking`);
    const slots = await response.json();
    
    // Update statistics
    updateStatistics(slots);
    
    // Update slot grid
    updateSlotGrid(slots);
    
    // Update time remaining
    updateTimeRemaining(slots);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Auto-update every 5 seconds
setInterval(updateLiveView, 5000);
```

#### 2. Booking System
```javascript
async function bookSlot(slotNumber, userData) {
  try {
    const response = await fetch(`${baseUrl}/api/parking/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slotNumber,
        userData,
        expectedDuration
      })
    });
    return response.json();
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
}
```

## API Documentation

### Endpoints

#### 1. GET /api/parking
Retrieves all parking slots
```http
GET http://localhost:3000/api/parking
Response:
[
  {
    "slotNumber": 1,
    "isOccupied": false,
    "vehicleNumber": null,
    "userData": null
  }
]
```

#### 2. POST /api/parking
Creates a new parking slot
```http
POST http://localhost:3000/api/parking
Body: {
  "slotNumber": 1
}
Response: {
  "message": "Slot created successfully",
  "slot": {
    "slotNumber": 1,
    "isOccupied": false
  }
}
```

#### 3. POST /api/parking/book
Books a parking slot
```http
POST http://localhost:3000/api/parking/book
Body: {
  "slotNumber": 1,
  "userData": {
    "name": "John Doe",
    "phoneNumber": "1234567890",
    "email": "john@example.com",
    "vehicleType": "car"
  },
  "vehicleNumber": "ABC123",
  "expectedDuration": 2
}
```

## Database Design

### MongoDB Schema
```javascript
const parkingSlotSchema = {
  _id: ObjectId,              // Automatic unique identifier
  slotNumber: Number,         // Unique slot identifier
  isOccupied: Boolean,        // Current occupancy status
  vehicleNumber: String,      // Vehicle registration number
  bookedAt: Date,            // Booking timestamp
  floor: Number,             // Parking floor number
  userData: {
    name: String,            // Customer name
    phoneNumber: String,     // Contact number
    email: String,          // Email address
    vehicleType: String     // Type of vehicle
  },
  expectedDuration: Number,  // Parking duration in hours
  bookingStatus: String,    // Current booking status
  __v: Number              // Version key
}
```

### Indexes
```javascript
// Primary index
db.parkingslots.createIndex({ "slotNumber": 1 }, { unique: true });

// Secondary indexes
db.parkingslots.createIndex({ "isOccupied": 1 });
db.parkingslots.createIndex({ "vehicleNumber": 1 });
```

## Security Implementation

### 1. Input Validation
```javascript
function validateUserInput(userData) {
  // Required fields
  if (!userData.name || !userData.phoneNumber || !userData.vehicleNumber) {
    throw new Error('Missing required fields');
  }
  
  // Phone number validation
  if (!/^\d{10}$/.test(userData.phoneNumber)) {
    throw new Error('Invalid phone number format');
  }
  
  // Vehicle number validation
  if (!/^[A-Z0-9-]{5,10}$/.test(userData.vehicleNumber)) {
    throw new Error('Invalid vehicle number format');
  }
  
  // Email validation (if provided)
  if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    throw new Error('Invalid email format');
  }
}
```

### 2. Error Handling
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal server error'
  });
});

// Route-specific error handling
try {
  // Operation code
} catch (error) {
  next(error);
}
```

## Performance Optimizations

### 1. Database Queries
```javascript
// Use lean queries for better performance
const slots = await ParkingSlot.find().lean();

// Select specific fields only
const slot = await ParkingSlot.findOne(
  { slotNumber },
  'isOccupied vehicleNumber userData'
);

// Use compound queries
const availableSlots = await ParkingSlot.find({
  isOccupied: false,
  floor: 1
}).sort({ slotNumber: 1 });
```

### 2. Frontend Optimizations
```javascript
// Debounce updates
const debouncedUpdate = debounce(updateLiveView, 1000);

// Efficient DOM updates
const fragment = document.createDocumentFragment();
slots.forEach(slot => {
  fragment.appendChild(createSlotElement(slot));
});
container.appendChild(fragment);

// Cache DOM elements
const slotGrid = document.getElementById('slotGrid');
const statusBar = document.getElementById('statusBar');
```

## Testing Implementation

### 1. API Tests
```javascript
describe('Parking API', () => {
  // Test creating new slot
  it('should create a new slot', async () => {
    const response = await request(app)
      .post('/api/parking')
      .send({ slotNumber: 1 });
    expect(response.status).toBe(201);
  });

  // Test booking slot
  it('should book an available slot', async () => {
    const response = await request(app)
      .post('/api/parking/book')
      .send({
        slotNumber: 1,
        userData: {
          name: 'Test User',
          phoneNumber: '1234567890'
        }
      });
    expect(response.status).toBe(200);
  });
});
```

### 2. Frontend Tests
```javascript
describe('Booking Interface', () => {
  // Test input validation
  it('should validate user input', () => {
    expect(validateUserInfo({
      name: 'John',
      phoneNumber: '1234567890'
    })).toBe(true);
  });

  // Test slot updates
  it('should update slot status', async () => {
    await updateSlotStatus(1, true);
    const slot = document.querySelector('.slot-1');
    expect(slot.classList.contains('occupied')).toBe(true);
  });
});
```

This technical documentation provides in-depth details about:
1. Complete system architecture
2. Detailed API documentation
3. Database schema and optimization
4. Security implementations
5. Performance optimizations
6. Testing strategies
7. Error handling
8. Frontend optimizations

Would you like me to add more details about any specific aspect of the system?