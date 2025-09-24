# Smart Parking System

A modern parking management system built with Node.js, Express, and MongoDB. This system allows users to manage parking slots, handle bookings, and monitor parking status in real-time.

## 📁 Project Structure
```
park_us/
├── src/
│   ├── index.js          # Main application entry point
│   ├── config/
│   │   └── db.js         # MongoDB connection configuration
│   ├── controllers/
│   │   └── parkingController.js  # Business logic for parking operations
│   ├── models/
│   │   └── ParkingSlot.js        # MongoDB schema for parking slots
│   └── routes/
│       └── parkingRoutes.js      # API route definitions
├── test-new.html         # Interactive testing interface
├── package.json          # Project dependencies and scripts
└── .env                  # Environment variables configuration
```

## 🚀 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variables management

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern features
- **JavaScript** - Client-side interactions
- **Fetch API** - AJAX requests

### Database
- **MongoDB Atlas** - Cloud database service

## 📌 Features

1. **Parking Slot Management**
   - Create new parking slots
   - View all parking slots
   - Check slot availability
   - Real-time slot status updates

2. **Booking System**
   - Book available slots
   - Store user information
   - Track booking duration
   - Automatic slot status updates

3. **User Management**
   - Store user details
   - Vehicle information tracking
   - Booking history

4. **Real-time Updates**
   - Live slot availability display
   - Automatic status refresh
   - Time remaining indicators
   - Occupancy statistics

## 🔌 API Endpoints

### Parking Slots
```
GET /api/parking         - Get all parking slots
POST /api/parking        - Create a new parking slot
POST /api/parking/book   - Book a parking slot
```

## 💾 Data Models

### ParkingSlot Schema
```javascript
{
  slotNumber: Number,
  isOccupied: Boolean,
  vehicleNumber: String,
  bookedAt: Date,
  floor: Number,
  userData: {
    name: String,
    phoneNumber: String,
    email: String,
    vehicleType: String
  },
  expectedDuration: Number,
  bookingStatus: String
}
```

## 🛠️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd park_us
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a .env file with:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Backend API: http://localhost:3000
   - Testing Interface: Open test-new.html in a browser

## 🔧 Development Tools

- **VS Code** - Code editor
- **Thunder Client/Postman** - API testing
- **MongoDB Compass** - Database management
- **Git** - Version control

## 🎯 Key Features Implementation

### Real-time Updates
- Automatic refresh every 5 seconds
- Live statistics display
- Color-coded slot status
- Time remaining calculations

### Booking System
- User information validation
- Slot availability checking
- Duration tracking
- Automatic status updates

### User Interface
- Responsive design
- Interactive booking form
- Real-time slot grid
- Status notifications
- Error handling

## 🔐 Security Features

- Input validation
- Error handling
- Secure database connections
- Environment variable protection

## 📊 Data Management

### MongoDB Collections
- `parkingslots` - Stores all parking slot information and bookings

### Data Operations
- CRUD operations for parking slots
- User data storage
- Booking management
- Status updates

## 🔄 System Flow

1. User enters their information
2. System checks slot availability
3. User selects an available slot
4. System processes booking
5. Real-time updates reflect changes
6. Automatic status monitoring

## 🚧 Future Enhancements

1. User authentication
2. Payment integration
3. Mobile app development
4. Automated notifications
5. Advanced analytics
6. Multiple parking locations

## 📝 Notes

- The system uses real-time monitoring
- All data is stored in MongoDB Atlas
- The interface updates automatically
- Error handling is implemented throughout
- The system is scalable for future features