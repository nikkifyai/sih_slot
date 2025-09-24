const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chalk = require('chalk');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(chalk.green('✅ Connected to MongoDB'));
    watchBookings();
  })
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
    const changeStream = collection.watch([], { fullDocument: 'updateLookup' });
    
    console.log(chalk.blue('🔍 Watching for parking slot changes...'));
    console.log(chalk.yellow('Press Ctrl+C to stop watching\n'));

    // Listen for changes
    changeStream.on('change', (change) => {
      const timestamp = new Date().toLocaleTimeString();

      switch(change.operationType) {
        case 'insert':
          console.log(chalk.green(`[${timestamp}] New parking slot created:`));
          console.log(chalk.green(`Slot #${change.fullDocument.slotNumber}`));
          break;

        case 'update':
          console.log(chalk.yellow(`[${timestamp}] Parking slot updated:`));
          
          if (change.fullDocument) {
            const slot = change.fullDocument;
            console.log(chalk.yellow(`Slot #${slot.slotNumber}`));
            console.log(chalk.yellow(`Status: ${slot.isOccupied ? 'Occupied' : 'Available'}`));
            
            if (slot.userData && slot.userData.name) {
              console.log(chalk.yellow(`User: ${slot.userData.name}`));
              console.log(chalk.yellow(`Vehicle: ${slot.vehicleNumber}`));
              console.log(chalk.yellow(`Duration: ${slot.expectedDuration} hours`));
            }
          }
          break;

        case 'delete':
          console.log(chalk.red(`[${timestamp}] Parking slot deleted`));
          break;
      }
      
      console.log('-----------------------------------');
    });

    changeStream.on('error', (error) => {
      console.error(chalk.red('Error in change stream:', error));
    });

  } catch (err) {
    console.error(chalk.red('Error setting up watch:', err));
    process.exit(1);
  }
}