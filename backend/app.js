// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();




//middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


app.get('/', (req, res) => {
    res.send('Hello, World!');
});   

//routes

const userRoutes = require('./routes/userRoutes')
const itemRoutes = require('./routes/itemRoutes')

app.use('/users', userRoutes);
app.use('/items', itemRoutes);


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});