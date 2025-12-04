const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { sequelize } = require('./models');
sequelize.sync()
  .then(() => {
    console.log("Database synced");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  })
  .catch(err => {
    console.error("Sequelize sync error:", err);
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
    res.send("API is working!");
});




module.exports = app;
