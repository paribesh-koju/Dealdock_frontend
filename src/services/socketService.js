import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3030";

class SocketService {
  socket = null;

  connect() {
    this.socket = io(SOCKET_URL);

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log("Socket disconnected");
      this.socket = null;
    }
  }

  joinRoom(chatRoomId, buyerId, sellerId, productId) {
    if (this.socket) {
      this.socket.emit("join_chat", {
        chatRoomId,
        buyerId,
        sellerId,
        productId,
      });
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit("send_message", messageData);
    }
  }

  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on("receive_message", callback);
    }
  }
}

export const socketService = new SocketService();

// socketService.js
// import { io } from "socket.io-client";

// class SocketService {
//   socket = null;

//   connect() {
//     if (!this.socket) {
//       this.socket = io("http://localhost:3030", {
//         transports: ["websocket"],
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//       });

//       this.socket.on("connect", () => {
//         console.log("Socket connected");
//       });

//       this.socket.on("connect_error", (error) => {
//         console.error("Socket connection error:", error);
//       });
//     }
//     return this.socket;
//   }

//   joinRoom(roomId) {
//     if (this.socket) {
//       this.socket.emit("join_room", roomId);
//     }
//   }

//   onReceiveMessage(callback) {
//     if (this.socket) {
//       this.socket.on("receive_message", callback);
//     }
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }
// }

// export const socketService = new SocketService();
