//connectDb.js
import mongoose from "mongoose";

const MONGO_URI =
	"mongodb+srv://devczdamian:FRfph7dbLupn70qJ@chainmove.0ohyt.mongodb.net/?retryWrites=true&w=majority&appName=ChainMove"; 
if (!MONGO_URI) {
  throw new Error(
    "MONGo DB uri missing"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDb;
