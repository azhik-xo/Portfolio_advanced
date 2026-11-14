const mongoose = require('mongoose');
const dns = require('dns');

// On Windows or environments with restricted local DNS, configure reliable public DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // If setServers fails in restricted env, continue with system defaults
}

let isConnected = false;
let retryTimer = null;
let isConnecting = false;

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[MongoDB] Mongoose connection event: connected to Atlas');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Mongoose connection event: disconnected');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('[MongoDB] Mongoose connection error:', err.message);
});

const connectDB = async () => {
  if (isConnecting || isConnected) return;
  isConnecting = true;

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }
    console.log(`[MongoDB] Connected to database: ${conn.connection.host} (${conn.connection.name})`);
    
    // Auto-seed initial data if collections are empty
    const { seedInitialData } = require('./seed');
    await seedInitialData();
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${uri.replace(/:([^:@]+)@/, ':****@')}. Running with in-memory fallback.`);
    console.warn(`[MongoDB] Reason: ${err.message}`);

    // Schedule background retry so it automatically connects as soon as Atlas whitelist or network is ready
    if (!retryTimer) {
      retryTimer = setInterval(() => {
        if (!isConnected) {
          console.log('[MongoDB] Retrying connection to MongoDB Atlas...');
          connectDB();
        }
      }, 20000);
    }
  } finally {
    isConnecting = false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
