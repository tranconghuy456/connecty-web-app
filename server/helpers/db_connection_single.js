import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

export const useConnect = async () => {
  const mongod = await MongoMemoryServer.create();
  const getUri = mongod.getUri();

  return await mongoose.connect(getUri);
};
