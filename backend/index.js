import express from "express";
import dotenv from "dotenv";
import makeDbConnection from "./dbConnection.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { configureCloudinary } from "./utility/cloudinary.js";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// make database connection
makeDbConnection();
configureCloudinary();

app.use("/user", userRouter);
app.use("/post", postRouter);

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("sendMessage", ({ message, sender }) => {
    io.emit("receiveMessage", {
      message,
      sender: sender,
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`listening at port: ${PORT}`);
});
