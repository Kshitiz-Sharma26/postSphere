import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const database = process.env.DATABASE;
const makeDbConnection = () => {
  mongoose
    .connect(database)
    .then(() => {
      console.log("database connected");
    })
    .catch((err) => {
      console.error("error while connecting to database");
    });
};

export default makeDbConnection;
