import mongoose from "mongoose";
import * as fs from "fs";

import logger from "../config/logger";

let hasConnection;
const connectMongo = async () => {
  if (!process.env.LINKFREE_MONGO_CONNECTION_STRING) {
    throw new Error(
      "Please define the LINKFREE_MONGO_CONNECTION_STRING environment variable (if local add to .env file)"
    );
  }

  if (hasConnection) {
    return hasConnection;
  }
  try {
    // DigitalOcean Apps has cert as environment variable but Mongo needs a file path
    // Write Mongo cert file to disk
    if (process.env.CA_CERT) {
      fs.writeFileSync("cert.pem", process.env.CA_CERT);
    }

    hasConnection = await mongoose.connect(
      process.env.LINKFREE_MONGO_CONNECTION_STRING,
      { autoIndex: true }
    );
    hasConnection = true;
    logger.info("MongoDB connected");
    return hasConnection;
  } catch (e) {
    hasConnection = false;
    logger.error(e, "DB connection failed");
  }
};

export default connectMongo;
