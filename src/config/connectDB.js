const mongoose = require('mongoose');

const url = process.env.MONGO_URL;
const conn = async () => {
    try {
        mongoose.connect(url, (error) => {
            if (error) {
                console.log(`Connection error 1 : ${error}`);
                process.exit(1);
            }
            console.log(`Connected MongoDB...`);
        })
    } catch (error) {
        console.log(`Connection error 2 : ${error}`);
        process.exit(1);
    }
}


module.exports = conn;