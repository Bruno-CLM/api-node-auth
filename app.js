require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const logger = require('./logger')

//Config Json Require
app.use(express.json());

// Open Route - Public Route
app.get('/', (req, res) => {
  res.status(200).json({message: "Bem vindo a API!"});
});

// Route - Auth
const authRoutes = require('./routes/authRoutes')
app.use("/auth", authRoutes);

// Private Route - User
const userRoutes = require('./routes/userRoutes')
app.use("/user", userRoutes);

//Config mongoose
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL)
.then(() =>{
  logger.info("DB connect!");
  app.listen(3000, () => {
    logger.info("Server is Runtime!");
  })
})
.catch((error) => {
  logger.error("DB error: " + error);
});
