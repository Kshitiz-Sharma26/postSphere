import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://localhost:8000", {
  autoConnect: false,
  reconnection: true,
});
