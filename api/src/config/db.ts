import { MongoClient, type Db } from "mongodb";
import { env } from "./env.js";

export const mongoClient = new MongoClient(env.MONGODB_URI);

let database: Db | null = null;

export const connectDatabase = async (): Promise<Db> => {
  if (database) {
    return database;
  }

  await mongoClient.connect();

  database = mongoClient.db(env.MONGODB_DATABASE);

  await database.command({ ping: 1 });

  console.log(`MongoDB connected: ${env.MONGODB_DATABASE}`);

  return database;
};

export const getDatabase = (): Db => {
  if (!database) {
    throw new Error(
      "Database has not been initialized. Call connectDatabase() first.",
    );
  }

  return database;
};
