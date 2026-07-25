const dns = require("node:dns");
const mongoose = require("mongoose");

// Force Node.js to use DNS servers that support MongoDB SRV records.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;