
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URL environment variable inside .env.local");
}

export const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected.");
    return;
  }
  if (connectionState === 2) {
    console.log("Connection is in progress.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!,{
      dbName: "B2C_cosmetic_store",
      bufferCommands:true
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
    throw err; 
  }
};

export const getConnectionState = () => mongoose.connection.readyState;