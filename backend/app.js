const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

const app = express();
const server = http.createServer(app);

// configure socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",  // allow all origins in production
    methods: ["GET", "POST"]
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
app.use(cors());

// socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // when client joins an "activity room"
  socket.on('join-activity', (activityId) => {
    socket.join(activityId);  // join room for this activity
    console.log(`Socket ${socket.id} joined activity ${activityId}`);
  });
  
  // when client leaves an activity room
  socket.on('leave-activity', (activityId) => {
    socket.leave(activityId);
    console.log(`Socket ${socket.id} left activity ${activityId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// make io available in the entire application
app.set('io', io);

// API routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/quotes', quoteRoutes);

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Sequelize sync error:', err);
  });

module.exports = app;
