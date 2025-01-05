// import React, { useState, useEffect } from "react";
// import { X, Circle } from "lucide-react";
// import "./HeaderPopups.css";
// import ChatPopup from "../chatpage/ChatPopup"; // Adjust path based on your structure
// import { socketService } from "../../services/socketService"; // Ensure Socket.IO service is imported
// import { getMessagesApi } from "../../apis/Api"; // Import the API function to fetch messages

// export const MessagePopup = ({ isOpen, onClose }) => {
//   const [messages, setMessages] = useState([]); // Store messages
//   const [selectedChat, setSelectedChat] = useState(null);
//   const user = JSON.parse(localStorage.getItem("user")); // Current logged-in user

//   useEffect(() => {
//     const initializeSocket = async () => {
//       try {
//         socketService.connect();
//         console.log("Socket connected successfully");
//       } catch (error) {
//         console.error("Failed to connect to socket:", error);
//       }
//     };

//     initializeSocket();

//     return () => {
//       socketService.disconnect();
//     };
//   }, []);

//   // Fetch messages from the API when the popup opens
//   useEffect(() => {
//     if (isOpen) {
//       const fetchMessages = async () => {
//         try {
//           const chatRoomId = user?._id; // Use the current user's ID as the chat room ID
//           const response = await getMessagesApi(chatRoomId);
//           console.log("Fetched messages:", response);
//           setMessages(Array.isArray(response) ? response : []);
//         } catch (error) {
//           console.error("Error fetching messages from API:", error);
//         }
//       };

//       fetchMessages();
//       socketService.connect();

//       const handleNewMessage = (message) => {
//         console.log("New message received via socket:", message);

//         // Ensure the message is for the current user (seller)
//         if (message.receiverId === user._id) {
//           const newMessage = {
//             senderId: message.senderId,
//             senderName: message.senderName || "Unknown",
//             senderImage: message.senderImage || null,
//             productId: message.productId,
//             lastMessage: message.message,
//             time: new Date(message.createdAt).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             }),
//             unread: true,
//           };

//           setMessages((prevMessages) => {
//             // Check if the message already exists to avoid duplicates
//             const exists = prevMessages.some(
//               (msg) =>
//                 msg.senderId === newMessage.senderId &&
//                 msg.productId === newMessage.productId
//             );

//             return exists ? prevMessages : [newMessage, ...prevMessages];
//           });
//         }
//       };

//       socketService.onReceiveMessage(handleNewMessage);

//       return () => {
//         socketService.socket?.off("receive_message", handleNewMessage);
//       };
//     }
//   }, [isOpen, user]);

//   const handleChatOpen = (message) => {
//     const chatData = {
//       seller: {
//         _id: message.senderId,
//         fullname: message.senderName,
//         profileImage: message.senderImage,
//       },
//       userId: user._id,
//       productId: message.productId,
//     };

//     setSelectedChat(chatData);
//     onClose(); // Close the messages popup when opening chat
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="header-popup messages-popup">
//         <div className="popup-header">
//           <h3>Messages</h3>
//           <button onClick={onClose} className="close-btn">
//             <X size={18} />
//           </button>
//         </div>
//         <div className="messages-list">
//           {messages.length === 0 ? (
//             <div className="empty-state">No messages yet</div>
//           ) : (
//             messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className="message-item"
//                 onClick={() => handleChatOpen(msg)}
//                 role="button"
//                 title="Click to open chat"
//               >
//                 <div className="message-avatar">
//                   {msg.senderImage ? (
//                     <img
//                       src={`http://localhost:3030/public/profiles/${msg.senderImage}`}
//                       alt={msg.senderName}
//                     />
//                   ) : (
//                     <div className="avatar-placeholder">
//                       {msg.senderName?.charAt(0)}
//                     </div>
//                   )}
//                   {msg.unread && (
//                     <Circle
//                       size={8}
//                       className="unread-indicator"
//                       fill="#ff9900"
//                     />
//                   )}
//                 </div>
//                 <div className="message-content">
//                   <div className="message-sender">{msg.senderName}</div>
//                   <div className="message-preview">{msg.lastMessage}</div>
//                   <div className="message-time">{msg.time}</div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Chat Popup */}
//       {selectedChat && (
//         <ChatPopup
//           isOpen={true}
//           onClose={() => setSelectedChat(null)}
//           seller={selectedChat.seller}
//           userId={selectedChat.userId}
//           productId={selectedChat.productId}
//         />
//       )}
//     </>
//   );
// };

// export const NotificationPopup = ({ isOpen, onClose, notifications = [] }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="header-popup notifications-popup">
//       <div className="popup-header">
//         <h3>Notifications</h3>
//         <button onClick={onClose} className="close-btn">
//           <X size={18} />
//         </button>
//       </div>
//       <div className="notifications-list">
//         {notifications.length === 0 ? (
//           <div className="empty-state">No notifications</div>
//         ) : (
//           notifications.map((notif, index) => (
//             <div key={index} className="notification-item">
//               <div className="notification-icon">
//                 <i className={`fas fa-${notif.icon || "bell"}`}></i>
//               </div>
//               <div className="notification-content">
//                 <div className="notification-text">{notif.text}</div>
//                 <div className="notification-time">{notif.time}</div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// MessagePopup.jsx
import React, { useState, useEffect } from "react";
import { X, Circle } from "lucide-react";
import "./HeaderPopups.css";
import ChatPopup from "../chatpage/ChatPopup";
import { socketService } from "../../services/socketService";
import { getMessagesApi } from "../../apis/Api";

export const MessagePopup = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Initialize socket and fetch messages
  useEffect(() => {
    if (isOpen && user?._id) {
      const initializeChat = async () => {
        try {
          // Connect socket
          socketService.connect();

          // Fetch initial messages
          const response = await getMessagesApi(user._id);
          console.log("API Response:", response);

          if (response?.data) {
            const formattedMessages = response.data.map((msg) => ({
              senderId: msg.senderId,
              senderName: msg.senderName || "Unknown",
              senderImage: msg.senderImage,
              productId: msg.productId,
              lastMessage: msg.message || msg.lastMessage,
              time: new Date(msg.createdAt || msg.timestamp).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
              unread: !msg.isRead,
            }));

            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error("Error initializing chat:", error);
        }
      };

      initializeChat();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isOpen, user]);

  // Handle real-time messages
  useEffect(() => {
    if (isOpen && user?._id) {
      const handleNewMessage = (message) => {
        console.log("New message received:", message);

        if (message.receiverId === user._id) {
          const newMessage = {
            senderId: message.senderId,
            senderName: message.senderName || "B",
            senderImage: message.senderImage,
            productId: message.productId,
            lastMessage: message.message,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unread: true,
          };

          setMessages((prev) => {
            const isDuplicate = prev.some(
              (msg) =>
                msg.senderId === newMessage.senderId &&
                msg.lastMessage === newMessage.lastMessage &&
                msg.time === newMessage.time
            );

            return isDuplicate ? prev : [newMessage, ...prev];
          });
        }
      };

      socketService.onReceiveMessage(handleNewMessage);

      return () => {
        socketService.socket?.off("receive_message");
      };
    }
  }, [isOpen, user]);

  const handleChatOpen = (message) => {
    const chatData = {
      seller: {
        _id: message.senderId,
        fullname: message.seller?.fullname,
        profileImage: message.senderImage,
      },
      userId: user._id,
      productId: message.productId,
    };

    setSelectedChat(chatData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="header-popup messages-popup">
        <div className="popup-header">
          <h3>Messages</h3>
          <button onClick={onClose} className="close-btn">
            <X size={18} />
          </button>
        </div>
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-state">No messages yet</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={`${msg.senderId}-${msg.time}-${index}`}
                className="message-item"
                onClick={() => handleChatOpen(msg)}
                role="button"
                title="Click to open chat"
              >
                <div className="message-avatar">
                  {msg.senderImage ? (
                    <img
                      src={`http://localhost:3030/public/profiles/${msg.senderImage}`}
                      alt={msg.senderName}
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {msg.senderName?.charAt(0) || "B"}
                    </div>
                  )}
                  {msg.unread && (
                    <Circle
                      size={8}
                      className="unread-indicator"
                      fill="#ff9900"
                    />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-sender">{msg.senderName}</div>
                  <div className="message-preview">{msg.lastMessage}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedChat && (
        <ChatPopup
          isOpen={true}
          onClose={() => setSelectedChat(null)}
          seller={selectedChat.seller.fullname}
          userId={selectedChat.userId}
          productId={selectedChat.productId}
        />
      )}
    </>
  );
};

export const NotificationPopup = ({ isOpen, onClose, notifications = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="header-popup notifications-popup">
      <div className="popup-header">
        <h3>Notifications</h3>
        <button onClick={onClose} className="close-btn">
          <X size={18} />
        </button>
      </div>
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">No notifications</div>
        ) : (
          notifications.map((notif, index) => (
            <div key={index} className="notification-item">
              <div className="notification-icon">
                <i className={`fas fa-${notif.icon || "bell"}`}></i>
              </div>
              <div className="notification-content">
                <div className="notification-text">{notif.text}</div>
                <div className="notification-time">{notif.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
