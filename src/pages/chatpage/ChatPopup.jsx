import React, { useState, useEffect, useRef } from "react";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import { getMessagesApi, markMessagesReadApi } from "../../apis/Api"; // Import REST APIs for initial load
import { socketService } from "../../services/socketService"; // Import Socket.IO service
import "./ChatPopup.css";

const ChatPopup = ({ isOpen, onClose, seller, userId, productId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const chatRoomId = `${[userId, seller?._id].sort().join("_")}_${productId}`; // Generate chatRoomId
  console.log("Generated chatRoomId:", chatRoomId); // Debug log
  console.log("userId:", userId); // Debug log
  console.log("seller?._id:", seller?._id); // Debug log
  console.log("productId:", productId); // Debug log

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Establish Socket.IO connection when chat opens
  useEffect(() => {
    if (isOpen) {
      socketService.connect();

      const buyerId = userId; // Assign the user's ID
      const sellerId = seller?._id; // Assign the seller's ID
      const chatRoomId = `${[buyerId, sellerId].sort().join("_")}_${productId}`; // Generate chatRoomId

      socketService.joinRoom(chatRoomId, buyerId, sellerId, productId);
      console.log("Joining room with details:", {
        chatRoomId,
        buyerId,
        sellerId,
        productId,
      });

      fetchMessages();

      // Attach listener only if it doesn't exist
      if (!socketService.socket.hasListeners("receive_message")) {
        socketService.onReceiveMessage((message) => {
          console.log("Message received:", message);

          setMessages((prev) => {
            // Check if the received message is already in the state
            const isDuplicate = prev.some(
              (msg) =>
                msg.text === message.message &&
                msg.sender ===
                  (message.senderId === userId ? "user" : "seller") &&
                msg.timestamp ===
                  new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
            );

            if (isDuplicate) {
              console.log("Duplicate message skipped:", message);
              return prev;
            }

            const newMessage = {
              text: message.message,
              sender: message.senderId === userId ? "user" : "seller",
              timestamp: new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };

            // Add new message to the end of the array to maintain chronological order
            return [...prev, newMessage];
          });
        });
      }
    }

    return () => {
      console.log("Disconnecting socket");
      socketService.disconnect();
    };
  }, [isOpen, userId, seller, productId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await getMessagesApi(chatRoomId);
      // Sort messages by timestamp before setting state
      const sortedMessages = response.data
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        .map((msg) => ({
          text: msg.message,
          sender: msg.senderId === userId ? "user" : "seller",
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

      setMessages(sortedMessages);

      // Scroll to the bottom after messages are loaded
      scrollToBottom();

      // Mark messages as read
      await markMessagesReadApi({ userId, chatRoomId });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      const newMessage = {
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Add new message to the end of the array
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Emit the message to the backend via Socket.IO
      socketService.sendMessage({
        senderId: userId,
        receiverId: seller?._id,
        productId,
        message,
        messageType: "text",
        chatRoomId,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) return null;

  return (
    <div className={`chat-popup ${isMinimized ? "minimized" : ""}`}>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="seller-info">
          <div className="seller-avatar">
            {seller?.fullname?.charAt(0) || "S"}
          </div>
          <span className="seller-name">{seller?.fullname || "Seller"}</span>
        </div>
        <div className="header-actions">
          <button onClick={handleMinimizeToggle} className="minimize-btn">
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button onClick={onClose} className="close-btn">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Content */}
      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="empty-chat">
                Start a conversation with the seller
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}-message`}>
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                {/* Invisible element for scrolling */}
                <div ref={messagesEndRef} style={{ height: "1px" }} />
              </>
            )}
          </div>

          {/* Message Input */}
          <div className="chat-input">
            <div className="input-container">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                maxLength={500}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="send-button"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPopup;
