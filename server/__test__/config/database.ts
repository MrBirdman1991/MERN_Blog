import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connect = async () => {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
};

const close = async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
};

const reset = async () => {
  await mongoose.connection.dropDatabase()
}

export default { connect, close, reset };
