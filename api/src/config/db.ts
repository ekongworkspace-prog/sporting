
import { MongoClient, type Db } from "mongodb";
import mongoose from "mongoose";
import { env } from "./env.js";

export const mongoClient = new MongoClient(env.MONGODB_URI);

let database: Db | null = null;
let connectionPromise: Promise<void> | null = null;

export const connectDatabase = async (): Promise<Db> => {
  if (database && mongoose.connection.readyState === 1) {
    return database;
  }

  if (!connectionPromise) {
    connectionPromise = (async () => {
      // Native MongoDB connection (Better Auth)
      await mongoClient.connect();

      database = mongoClient.db(env.MONGODB_DATABASE);
      await database.command({ ping: 1 });

      // Mongoose connection (application models)
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(env.MONGODB_URI, {
          dbName: env.MONGODB_DATABASE,
          serverSelectionTimeoutMS: 10000,
        });
      }

      console.log("Native MongoDB and Mongoose connected");
    })();
  }

  try {
    await connectionPromise;
    return database!;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};

export const getDatabase = (): Db => {
  if (!database) {
    throw new Error(
      "Database has not been initialized. Call connectDatabase() first.",
    );
  }

  return database;
};
