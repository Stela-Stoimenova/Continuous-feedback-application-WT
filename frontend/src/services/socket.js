// socket.io client service for real-time communication
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
  }

  // connect to server
  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });
  }

  // join a specific activity (room)
  joinActivity(activityId) {
    if (this.socket) {
      this.socket.emit('join-activity', activityId);
    }
  }

  // listen for new feedback
  onNewFeedback(callback) {
    if (this.socket) {
      this.socket.on('new-feedback', callback);
    }
  }

  // stop listening for feedback
  offNewFeedback() {
    if (this.socket) {
      this.socket.off('new-feedback');
    }
  }

  // leave activity room
  leaveActivity(activityId) {
    if (this.socket) {
      this.socket.emit('leave-activity', activityId);
    }
  }

  // disconnect completely
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();




