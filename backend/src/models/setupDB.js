const mongoose = require('mongoose');

const InitDB = () =>{
    const dbUrl = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);
    mongoose.connect(dbUrl);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
        console.log('Connected to MongoDB');
    });
    return db;
}

module.exports = InitDB;