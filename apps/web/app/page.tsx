"use client";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import classes from "./page.module.css";
export default function Page() {
  const { sendMessage, message } = useSocket();
  const [messages, setMessages] = useState("");
  return (
    <div>
      <div>
        <h1>All Messages will appear here</h1>
      </div>
      <div>
        <input
          className={classes["chat-input"]}
          type="text"
          placeholder="Message...."
          onChange={(e) => setMessages(e.target.value)}
        />
        <button
          onClick={(e) => sendMessage(messages)}
          className={classes["button"]}
        >
          Send
        </button>
      </div>
      <div>
        {message.map((e) => (
          <li>{e}</li>
        ))}
      </div>
    </div>
  );
}
