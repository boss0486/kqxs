 const mongoose = require('mongoose');

const connectDatabase = () => {
    const mongoDbUrl = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
    console.log(`Connecting to : ${mongoDbUrl}`);
    mongoose.Promise = global.Promise;
    //
    mongoose.connect(mongoDbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log('connected to the database');
    }).catch((err) => {
        console.log(`cound not connect to the database \n${err}`);
        process.exit();
    });
};

module.exports = connectDatabase;