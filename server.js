const express = require('express');
const cors = require('cors')
require('dotenv').config();
const router = require('./routes/route')
require('./db/connection')
const app = express();
const path = require('path')
const Port = process.env.PORT || 4000;


// middleware

app.use(express.json());
app.use(cors());
app.use(router);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(Port, () => {
    console.log(`server start on ${Port}`);
})