import mongoose from "mongoose";

export const connectDb = async (uri: string, dbName: string) => {
  try {
    await mongoose.connect(uri, { dbName });
    console.log("Connect db thành công!");
  } catch (error) {
    console.log("Connect db thất bại!");
    process.exit(1);
  }
};
