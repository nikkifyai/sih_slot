import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(chalk.green('✅ Connected to MongoDB')))
  .catch(err => {
    console.error(chalk.red('❌ Connection error:', err));
    process.exit(1);
  });

// Watch for changes in the parkingslots collection
async function watchBookings() {
  try {
    // Get a reference to the parkingslots collection
    const collection = mongoose.connection.collection('parkingslots');
    
    // Create a change stream
    const changeStream = collection.watch();
    
    console.log(chalk.blue('🔍 Watching for parking slot changes...'));
    console.log(chalk.yellow('Press Ctrl+C to stop watching\n'));

    // Listen for changes using async iteration
    for await (const change of changeStream) {
      const timestamp = new Date().toLocaleTimeString();

      if (change.operationType === 'insert') {
        // New parking slot created
        console.log(chalk.green(`[${timestamp}] New parking slot created:`));
        console.log(chalk.green(`Slot #${change.fullDocument.slotNumber}`));
      }
      else if (change.operationType === 'update') {
        // Parking slot updated (booking or status change)
        console.log(chalk.yellow(`[${timestamp}] Parking slot updated:`));
        
        // Show what changed
        const updates = change.updateDescription.updatedFields;
        if (updates.isOccupied !== undefined) {
          console.log(chalk.yellow(`Slot status changed: ${updates.isOccupied ? 'Occupied' : 'Available'}`));
        }
        if (updates['userData.name']) {
          console.log(chalk.yellow(`New booking by: ${updates['userData.name']}`));
          console.log(chalk.yellow(`Vehicle: ${updates.vehicleNumber}`));
          console.log(chalk.yellow(`Duration: ${updates.expectedDuration} hours`));
        }
      }
      else if (change.operationType === 'delete') {
        // Parking slot deleted
        console.log(chalk.red(`[${timestamp}] Parking slot deleted`));
      }
      
      console.log('-----------------------------------');
    }

  } catch (err) {
    console.error(chalk.red('Error setting up watch:', err));
    process.exit(1);
  }
}

// Start watching
watchBookings();