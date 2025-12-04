const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const { sequelize } = require('./models');

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

// Start server AFTER database connects
sequelize.sync()
    .then(() => {
        console.log("Database synced successfully");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error syncing database:", err);
    });

    console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);


module.exports = app;
