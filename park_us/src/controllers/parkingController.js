import ParkingSlot from "../models/ParkingSlot.js";

// Get all parking slots
export const getAllSlots = async (req, res) => {
  try {
    console.log('Getting all parking slots...');
    const slots = await ParkingSlot.find();
    console.log('Found slots:', slots);
    res.json(slots);
  } catch (err) {
    console.error('Error getting slots:', err.message);
    res.status(500).json({ message: err.message });
  }
};

//  Add a new parking slot
export const addSlot = async (req, res) => {
  const { slotNumber } = req.body;

  try {
    const slot = new ParkingSlot({ slotNumber });
    await slot.save();
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Book a parking slot
export const bookSlot = async (req, res) => {
  const { 
    slotNumber, 
    vehicleNumber,
    userData,
    expectedDuration,
    vehicleType
  } = req.body;

  // Validate required fields
  if (!slotNumber || !vehicleNumber || !userData || !userData.name || !userData.phoneNumber) {
    return res.status(400).json({ 
      message: "Missing required fields. Please provide slotNumber, vehicleNumber, and user details (name and phone number)"
    });
  }

  try {
    const slot = await ParkingSlot.findOne({ slotNumber });
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isOccupied) return res.status(400).json({ message: "Slot already occupied" });

    // Update slot with user data
    slot.isOccupied = true;
    slot.vehicleNumber = vehicleNumber;
    slot.bookedAt = new Date();
    slot.userData = {
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      email: userData.email || null,
      vehicleType: vehicleType || 'car'
    };
    slot.expectedDuration = expectedDuration || 1;
    slot.bookingStatus = 'active';
    
    await slot.save();

    res.json({ 
      message: "Slot booked successfully", 
      slot,
      bookingDetails: {
        slotNumber: slot.slotNumber,
        floor: slot.floor,
        bookedAt: slot.bookedAt,
        expectedDuration: slot.expectedDuration,
        vehicleType: slot.userData.vehicleType
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Free a parking slot
export const freeSlot = async (req, res) => {
  const { slotNumber } = req.body;

  try {
    const slot = await ParkingSlot.findOne({ slotNumber });
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (!slot.isOccupied) return res.status(400).json({ message: "Slot is already free" });

    // Calculate parking duration
    const parkingDuration = new Date() - slot.bookedAt;
    const hoursParked = Math.ceil(parkingDuration / (1000 * 60 * 60));

    // Store the booking details before clearing
    const bookingDetails = {
      vehicleNumber: slot.vehicleNumber,
      userData: slot.userData,
      bookedAt: slot.bookedAt,
      duration: hoursParked,
      status: 'completed'
    };

    // Clear the slot
    slot.isOccupied = false;
    slot.vehicleNumber = null;
    slot.bookedAt = null;
    slot.userData = {
      name: null,
      phoneNumber: null,
      email: null,
      vehicleType: 'car'
    };
    slot.expectedDuration = null;
    slot.bookingStatus = 'completed';
    await slot.save();

    res.json({ 
      message: "Slot freed successfully", 
      bookingDetails,
      slot 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSlotFromML = async (req, res) => {
    try {
        const { slotId, status, confidence, timestamp } = req.body;
        
        // Validate ML input
        if (!slotId || !status || !confidence) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required ML detection data" 
            });
        }

        // Find and update the slot
        const slot = await ParkingSlot.findOne({ slotNumber: slotId });
        if (!slot) {
            // Create new slot if it doesn't exist
            const newSlot = new ParkingSlot({
                slotNumber: slotId,
                isOccupied: status === 'occupied',
                mlDetection: {
                    lastUpdate: timestamp || new Date(),
                    confidence: confidence,
                    status: status
                }
            });
            await newSlot.save();
            return res.status(201).json({
                success: true,
                message: "New slot created from ML detection",
                slot: newSlot
            });
        }

        // Update existing slot
        slot.isOccupied = status === 'occupied';
        slot.mlDetection = {
            lastUpdate: timestamp || new Date(),
            confidence: confidence,
            status: status
        };
        await slot.save();

        res.status(200).json({
            success: true,
            message: "Slot updated from ML detection",
            slot: slot
        });

    } catch (error) {
        console.error("ML Update Error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating slot from ML detection",
            error: error.message
        });
    }
};

