import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import API from "../api/api";

const ChatBox = ({ chatId, user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_chat", chatId);

    API.get(`/messages/${chatId}`).then(res => {
      setMessages(res.data);
    });

    socket.on("receive_message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("user_typing", () => setTyping(true));
    socket.on("stop_typing", () => setTyping(false));

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("stop_typing");
    };
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (e) => {
    setText(e.target.value);
    socket.emit("typing", { chatId, userId: user._id });

    setTimeout(() => {
      socket.emit("stop_typing", { chatId });
    }, 800);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageData = {
      chatId,
      senderId: user._id,
      text
    };

    socket.emit("send_message", messageData);
    await API.post("/messages", messageData);

    setMessages(prev => [...prev, messageData]);
    setText("");
  };

  return (
    <div>
      <div style={{ height: 300, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.senderId === user._id ? "You" : "User"}:</b> {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typing && <p><i>Typing...</i></p>}

      <input
        value={text}
        onChange={handleTyping}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
