const mongoose = require("mongoose");

// MongoDB connection configuration
const connectMongoDB = async () => {
  try {
    // Use environment variable for production, localhost for development
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/Recipes_db";

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("📴 Mongoose disconnected");
});

// Close MongoDB connection when Node.js process is terminated
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("👋 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
    process.exit(1);
  }
});

module.exports = { connectMongoDB, mongoose };
