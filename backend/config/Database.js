const mongoose = require('mongoose');
const { MONGO_URL } = process.env 

exports.connect = () => {
    mongoose.set('strictQuery', true)
    mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to ' + MONGO_URL);
    }).catch((error) => {
        console.error('Error connecting to ' + MONGO_URL);
        console.error(error);
        process.exit(1);
    })
}