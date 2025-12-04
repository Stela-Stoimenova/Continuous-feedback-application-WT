const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test route
app.get('/', (req, res) => res.json({ message: 'Server running' }));

// Routes
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);
app.use('/feedbacks', feedbackRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Sequelize sync error:', err);
});
