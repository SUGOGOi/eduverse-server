import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(`${process.env.MONGO_LOCAL}`);

    console.log(`mongodb connected ${connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
