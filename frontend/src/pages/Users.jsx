import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    if (!token || !currentUser) {
      navigate("/login");
      return;
    }

    // mark current user online
    socket.emit("user_online", currentUser._id);

    axios
      .get("https://chat-application-yy3j.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUsers(res.data))
      .catch(() => navigate("/login"));

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, [navigate, token, currentUser]);

  /* ================= CREATE / GET CHAT ================= */
  const startChat = async (otherUserId) => {
    try {
      const res = await axios.post(
        "https://chat-application-yy3j.onrender.com/api/chats",
        {
          userId: otherUserId   // ✅ THIS WAS THE ISSUE
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Unable to start chat");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center py-4">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h4 className="text-center mb-4">Users</h4>

              {users.length === 0 ? (
                <div className="text-center text-muted">
                  No users available
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => startChat(user._id)}
                      className="list-group-item list-group-item-action py-3 text-start"
                    >
                      {/* Name + Online Indicator */}
                      <div className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: onlineUsers.includes(user._id)
                              ? "green"
                              : "gray"
                          }}
                        />
                        <span className="fw-semibold">
                          {user.name}
                        </span>
                      </div>

                      {/* Last Message Preview */}
                      <div className="text-muted small mt-1">
                        {user.lastMessage || "No messages yet"}
                      </div>

                      {/* Email */}
                      <div className="text-muted small">
                        {user.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
