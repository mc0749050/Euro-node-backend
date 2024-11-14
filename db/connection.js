const mongoose = require('mongoose');

const URL = process.env.MONGODB_URL

mongoose.connect(URL).then(() =>{
    console.log('db connected');
}).catch((err) => {
    console.log(err);
})