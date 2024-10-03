const mongoose = require("mongoose")
const connection = async()=>{
    try{
        await mongoose.connect(process.env.url)
        .then(()=>(
            console.log("connected to DB")
        ))
    }
    catch(e){
        console.log("error");
        
    }
}
module.exports = connection;