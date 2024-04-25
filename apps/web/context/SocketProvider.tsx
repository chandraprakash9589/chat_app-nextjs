"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
interface SocketProviderProps {
  children?: React.ReactNode;
}
interface ISocketContext {
  sendMessage: (msg: string) => any;
  message:string[]
}
const SocketContext = React.createContext<ISocketContext | null>(null);
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);
  return state;
};
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [message, setMessage] = useState<string[]>([]);
  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg) => {
      console.log("Send Message", msg);
      if (socket) {
        socket.emit("event:massage", { message: msg });
      }
    },
    [socket]
  );
  const onMessageRec = useCallback((msg: string) => {
    console.log("From Server Msg Rec", msg);
    const { message } = JSON.parse(msg) as { message: string };
    setMessage((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    _socket.on("message", onMessageRec);
    setSocket(_socket);
    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageRec);

      setSocket(undefined);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ sendMessage ,message}}>
      {children}
    </SocketContext.Provider>
  );
};
