require('dotenv').config();
const express = require("express");
const cookiParser = require("cookie-parser")
const data = require('./top_50_highest_rated_restaurants.json')
const connection = require('./connect');
const { HotelModel, Restaurant, User } = require('./Model/Restraurant');
const appRouter = require('./RestaurantRouters');

const cors = require("cors")

const routeruser = require('./user');
const app = express()
app.use(express.json())


app.use(cors({
    origin:"http://localhost:5173",
    methods:"GET , POST , PUT , DELETE",
    credentials:true,
}))
app.use(cookiParser(process.env.SECRET_TOKEN_KEY))


app.use("/auth" , routeruser)
app.use("/" , appRouter)


connection()
.then(()=>{
    app.post("/post-hotel" , async(req , res)=>{
        try {
            const hotelsAdded = req.body; // Expecting JSON data in the body of the request
            console.log(hotelsAdded);

            // Insert multiple records into MongoDB
            const y = await Restaurant.insertMany(hotelsAdded)

            res.status(201).json({ message: 'Doctors saved successfully!' });
        } catch (error) {
            console.error('Error saving hotelsAdded:', error);
            res.status(500).json({ message: 'An error occurred while saving hotelsAdded.' });
        }
    })
    app.post("/user" , async(req , res)=>{
        const {name , email} = req.body;
        const user = await User.create({name , email})
        res.status(200).json(user)
    })
    app.listen(process.env.PORT , ()=>{
        console.log("listening to PORT" , process.env.PORT);
        
    })
})
// {
