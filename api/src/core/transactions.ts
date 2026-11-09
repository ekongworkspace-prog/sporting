import mongoose, { type ClientSession } from "mongoose";

export async function withTransaction<T>(
  operation: (session: ClientSession) => Promise<T>,
): Promise<T> {
  return mongoose.connection.transaction(operation);
}
