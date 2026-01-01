import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("https://chat-application-yy3j.onrender.com");

// helper
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.id;
};

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");
  const loggedInUserId = getUserIdFromToken();

  /* ================= FETCH + SOCKET ================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`https://chat-application-yy3j.onrender.com/api/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMessages(res.data));

    socket.emit("joinChat", chatId);

    socket.on("receiveMessage", message => {
      setMessages(prev => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, [chatId, navigate, token]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await axios.post(
      "https://chat-application-yy3j.onrender.com/api/messages",
      { chatId, text },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages(prev => [...prev, res.data]);
    socket.emit("sendMessage", res.data);
    setText("");
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center bg-light">
      {/* 🔥 WIDE CHAT CONTAINER */}
      <div
        className="d-flex flex-column w-100"
        style={{
          maxWidth: "85vw",     // 👉 EXPANDS HORIZONTALLY
          margin: "20px auto"
        }}
      >
        <div className="card shadow-lg flex-grow-1">

          {/* Header */}
          <div className="card-header text-center fw-bold fs-5">
            Chat
          </div>

          {/* Messages */}
          <div
            className="card-body overflow-auto"
            style={{ background: "#f5f5f5" }}
          >
            {messages.map(msg => {
              const senderId =
                typeof msg.sender === "string"
                  ? msg.sender
                  : msg.sender?._id;

              const isSender = senderId === loggedInUserId;

              return (
                <div
                  key={msg._id}
                  className={`d-flex mb-3 ${
                    isSender ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-3 ${
                      isSender ? "bg-success text-white" : "bg-white"
                    }`}
                    style={{
                      maxWidth: "60%",            // bubble width
                      wordBreak: "break-word",
                      overflowWrap: "break-word"
                    }}
                  >
                    {!isSender && msg.sender?.name && (
                      <small className="fw-bold d-block mb-1">
                        {msg.sender.name}
                      </small>
                    )}
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="card-footer">
            <form onSubmit={sendMessage} className="d-flex gap-2">
              <input
                className="form-control"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="btn btn-primary px-4">
                Send
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;
