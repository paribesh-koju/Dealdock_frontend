import React, { useState, useEffect, useRef } from "react";
import "./MainHeader.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Postpage from "../pages/postpage/Postpage";
import {
  MessagePopup,
  NotificationPopup,
} from "../pages/messagenotification/MessagePopup";
import ChatPopup from "../pages/chatpage/ChatPopup";
import { socketService } from "../services/socketService";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessagesPopupOpen, setIsMessagesPopupOpen] = useState(false);
  const [isNotificationsPopupOpen, setIsNotificationsPopupOpen] =
    useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const dropdownRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const unreadMessageCount = messages.filter((msg) => msg.unread).length;
  const unreadNotificationCount = notifications.filter(
    (notif) => notif.unread
  ).length;

  // Initialize user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUserData(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Real-time message listener
  useEffect(() => {
    if (!userData) return;

    const handleNewMessage = (message) => {
      console.log("New message received:", message);

      if (message.receiverId === userData._id) {
        const newMessage = {
          senderName: message.fullname || "B",
          senderId: message.senderId,
          senderImage: message.senderImage || null,
          lastMessage: message.message,
          time: new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          unread: true,
          productId: message.productId,
        };

        setMessages((prevMessages) => {
          const exists = prevMessages.some(
            (msg) =>
              msg.senderId === newMessage.senderId &&
              msg.productId === newMessage.productId
          );
          return exists ? prevMessages : [newMessage, ...prevMessages];
        });
      }
    };

    socketService.onReceiveMessage(handleNewMessage);

    return () => {
      socketService.socket?.off("receive_message", handleNewMessage);
    };
  }, [userData]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleChatOpen = (message) => {
    setSelectedChat({
      seller: {
        _id: message.senderId,
        fullname: message.senderName,
        profileImage: message.senderImage,
      },
      userId: userData._id,
      productId: message.productId,
    });
    setIsMessagesPopupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-left">
          <a href="/home">
            <img src="/assets/logo.png" alt="DealDock Logo" className="logo" />
          </a>
        </div>

        <div className="header-center">
          <input
            type="text"
            className="search-input"
            placeholder="Search for anything"
          />
          <button className="search-button">
            <i className="fa fa-search"></i>
          </button>
        </div>

        <div className="header-right">
          <div style={{ position: "relative" }}>
            <i
              className="fa fa-comments icon"
              onClick={() => {
                setIsMessagesPopupOpen(!isMessagesPopupOpen);
                setIsNotificationsPopupOpen(false);
                setIsDropdownOpen(false);
              }}
            ></i>
            {unreadMessageCount > 0 && (
              <span className="notification-badge">{unreadMessageCount}</span>
            )}
            <MessagePopup
              isOpen={isMessagesPopupOpen}
              onClose={() => setIsMessagesPopupOpen(false)}
              initialMessages={messages}
              onChatSelect={handleChatOpen}
            />
          </div>

          <div style={{ position: "relative" }}>
            <i
              className="fa fa-bell icon"
              onClick={() => {
                setIsNotificationsPopupOpen(!isNotificationsPopupOpen);
                setIsMessagesPopupOpen(false);
                setIsDropdownOpen(false);
              }}
            ></i>
            {unreadNotificationCount > 0 && (
              <span className="notification-badge">
                {unreadNotificationCount}
              </span>
            )}
            <NotificationPopup
              isOpen={isNotificationsPopupOpen}
              onClose={() => setIsNotificationsPopupOpen(false)}
              notifications={notifications}
            />
          </div>

          <button
            className="post-button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            + Post for free
          </button>

          <div className="user-profile-container" ref={dropdownRef}>
            <div
              className="user-profile"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {userData?.profileImage ? (
                <img
                  src={`http://localhost:3030/public/profiles/${userData.profileImage}`}
                  alt="Profile"
                  className="profile-icon-img"
                />
              ) : (
                <i className="fas fa-user-circle profile-icon"></i>
              )}
              <span>{userData?.fullname || "Guest"}</span>
            </div>
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="profile-section-header">
                  {userData?.profileImage ? (
                    <img
                      src={`http://localhost:3030/public/profiles/${userData.profileImage}`}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    <i className="fas fa-user-circle profile-placeholder-icon"></i>
                  )}
                  <div className="profile-text">
                    <div className="username">
                      {userData?.fullname || "Guest"}
                    </div>
                    <a href="/profile" className="visit-profile">
                      Visit Profile
                    </a>
                  </div>
                </div>
                <hr />
                <button className="menu-item">Contact Support</button>
                <div className="logout-section">
                  <button onClick={handleLogout} className="logout-button">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ChatPopup Component */}
      {selectedChat && (
        <ChatPopup
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          seller={selectedChat.seller.fullname}
          userId={selectedChat.userId}
          productId={selectedChat.productId}
        />
      )}

      <Postpage />
    </>
  );
};

export default Header;
