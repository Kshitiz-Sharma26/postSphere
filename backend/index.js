import express from "express";
import dotenv from "dotenv";
import makeDbConnection from "./dbConnection.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// make database connection
makeDbConnection();

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
