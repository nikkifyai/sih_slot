import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB');
    watchBookings();
  })
  .catch(err => {
    console.error(' Connection error:', err);
    process.exit(1);
  });

// Watch for changes in the parkingslots collection
async function watchBookings() {
  try {
    const collection = mongoose.connection.collection('parkingslots');
    const changeStream = collection.watch();
    
    console.log(' Watching for parking slot changes...');
    console.log('Press Ctrl+C to stop watching\n');

    // Using async/await with the change stream
    while (true) {
      try {
        const change = await changeStream.next();
        const timestamp = new Date().toLocaleTimeString();
        
        switch(change.operationType) {
          case 'insert':
            console.log(`[${timestamp}] ✨ New slot created: #${change.fullDocument.slotNumber}`);
            break;
            
          case 'update':
            console.log(`[${timestamp}]  Slot updated:`);
            if (change.updateDescription.updatedFields) {
              const updates = change.updateDescription.updatedFields;
              if (updates['userData.name']) {
                console.log(`👤 New booking by: ${updates['userData.name']}`);
                console.log(`🚗 Vehicle: ${updates.vehicleNumber}`);
                console.log(`⏱️ Duration: ${updates.expectedDuration} hours`);
              }
              if (updates.isOccupied !== undefined) {
                console.log(`${updates.isOccupied ? '🔴 Slot occupied' : '🟢 Slot available'}`);
              }
            }
            break;
            
          case 'delete':
            console.log(`[${timestamp}]  Slot deleted`);
            break;
        }
        console.log('-----------------------------------');
      } catch (error) {
        if (error.name === 'MongoNetworkError') {
          console.error('Lost connection to MongoDB. Retrying...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          throw error;
        }
      }
    }
  } catch (err) {
    console.error('Error setting up watch:', err);
    process.exit(1);
  }
}