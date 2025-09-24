import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  vehicleNumber: {
    type: String,
    default: null,
  },
  bookedAt: {
    type: Date,
    default: null,
  },
  floor: {
    type: Number,
    default: 1
  },
  // New fields for user data
  userData: {
    name: {
      type: String,
      default: null
    },
    phoneNumber: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    vehicleType: {
      type: String,
      enum: ['car', 'bike', 'truck'],
      default: 'car'
    }
  },
  expectedDuration: {
    type: Number, // Duration in hours
    default: null
  },
  bookingStatus: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  mlDetection: {
    lastUpdate: {
      type: Date,
      default: Date.now
    },
    confidence: {
      type: Number,
      required: false
    },
    status: {
      type: String,
      enum: ['empty', 'occupied', 'uncertain'],
      required: false
    }
  }
});

const ParkingSlot = mongoose.model("ParkingSlot", parkingSlotSchema);

export default ParkingSlot;
