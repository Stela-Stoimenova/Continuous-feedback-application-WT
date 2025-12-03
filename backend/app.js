const express = require('express');
const cors=require('cors');
const app=express();
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const {sequelize} = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const authRoutes=require('./routes/authRoutes');
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/activities', activityRoutes);
app.use('/feedbacks', feedbackRoutes);

module.exports=app;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});