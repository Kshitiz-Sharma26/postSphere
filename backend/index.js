import express from "express";
import dotenv from "dotenv";
import makeDbConnection from "./dbConnection.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// make database connection
makeDbConnection();

app.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
