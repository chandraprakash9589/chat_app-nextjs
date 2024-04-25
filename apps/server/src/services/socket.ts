//@ts-nocheck
import { Server, ServerOptions } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});
const sub = new Redis({
  host: process.env.HOST,
  port: process.env.PORT,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Service...");
    // Define CORS options
    const corsOptions: ServerOptions = {
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    };
    // Create the server instance with CORS options
    this._io = new Server(corsOptions);
    sub.subscribe("MESSAGE");
  }
  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners........");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:massage", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);
        //publish this message to redis(thi is nosql database)
        await pub.publish("MESSAGE", JSON.stringify({ message }));
      });
    });
    sub.on("message", (channel, message) => {
      if (channel === "MESSAGE") {
        io.emit("message", message);
      }
    });
  }
  get io() {
    return this._io;
  }
}
export default SocketService;

// import { useEffect, useState } from "react";
// import { Server } from "socket.io";

// function useSocketService() {
//   const [io, setIo] = useState(null);

//   useEffect(() => {
//     console.log("Init Socket Service...");
//     const socketServer = new Server();
//     setIo(socketServer);

//     return () => {
//       // Clean-up function
//       socketServer.close();
//     };
//   }, []);

//   return io;
// }

// export default useSocketService;
