const express = require('express');
const app = express();
require('./models/User');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');

const mongoUri = "mongodb+srv://shock:bond1234@developer-wt5tl.mongodb.net/test?retryWrites=true&w=majority"

app.use(bodyParser.json());
app.use(authRoutes);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log("Connected to DataBase");
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
});

app.get("/", requireAuth, (req, res) => {
    res.send(`your email: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log("server is running");
});