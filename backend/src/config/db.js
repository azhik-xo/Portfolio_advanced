const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, some local DNS servers fail SRV resolution for mongodb+srv://
// We configure reliable public DNS servers (Google 8.8.8.8, Cloudflare 1.1.1.1) as fallback
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // If setServers fails in restricted env, continue with system defaults
}

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.host} (${conn.connection.name})`);
  } catch (err) {
    isConnected = false;
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${uri.replace(/:([^:@]+)@/, ':****@')}. Running with in-memory fallback.`);
    console.warn(`[MongoDB] Reason: ${err.message}`);
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
