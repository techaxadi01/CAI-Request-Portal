const mongoose = require('mongoose');
const dns = require('dns');
const { demoUsers, sampleRequestsTemplate } = require('../seedData');

// Fix for Windows ISP DNS blocking MongoDB SRV queries locally
if (!process.env.VERCEL) {
  try {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
  } catch (err) {
    console.warn('DNS server adjustment skipped:', err.message);
  }
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function seedInitialData() {
  const User = require('../models/User');
  const Request = require('../models/Request');

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial demo users...');
      const createdUsers = await User.insertMany(demoUsers);
      console.log(`✅ Seeded ${createdUsers.length} demo users.`);

      const usersMap = {};
      createdUsers.forEach((u) => {
        usersMap[u.email] = u;
      });

      const reqCount = await Request.countDocuments();
      if (reqCount === 0) {
        console.log('🌱 Seeding initial sample requests across campuses...');
        const initialRequests = sampleRequestsTemplate(usersMap);
        const createdReqs = await Request.insertMany(initialRequests);
        console.log(`✅ Seeded ${createdReqs.length} sample requests.`);
      }
    }
  } catch (err) {
    console.error('Error during auto-seed:', err.message);
  }
}

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI / MONGO_URI is not defined in environment!');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then(async (m) => {
        console.log('✅ Connected to MongoDB Atlas Cloud Database!');
        await seedInitialData();
        return m;
      })
      .catch((err) => {
        console.error('❌ MongoDB Atlas connection error:', err.message);
        cached.promise = null;
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

module.exports = {
  connectDB,
  seedInitialData,
};
