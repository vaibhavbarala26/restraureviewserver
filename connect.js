const mongoose = require("mongoose")
const connection = async () => {
    try {
        await mongoose.connect(process.env.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 50000, // Increase to 30 seconds
            socketTimeoutMS: 50000
        })
            .then(() => (
                console.log("connected to DB")
            ))
    }
    catch (e) {
        console.log("error");

    }
}
module.exports = connection;