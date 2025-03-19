import express from "express";
import dotenv from "dotenv";
import makeDbConnection from "./dbConnection.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import cookieParser from "cookie-parser";
import { configureCloudinary } from "./utility/cloudinary.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// make database connection
makeDbConnection();
configureCloudinary();

app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
