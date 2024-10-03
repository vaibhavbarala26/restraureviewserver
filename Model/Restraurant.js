
const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});
const LikedBySchema = new mongoose.Schema({
    user:{
        type:String,
    }
})
const DislikedBySchema = new mongoose.Schema({
    user:{
        type:String,
    }
})
// Define the Review schema
// Define the Review schema
const reviewSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  // Reference to the User model
        required: true 
    },
    user_name: {
        type: String,
    },
    review_text: {
        type: String,
        required: true
    },
    Type: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    disliked: {
        type: Number,
        default: 0
    },
    stars: {
        type: Number,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'  // References to User model
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'  // References to User model
    }]
});

// Define the Restaurant schema
const restaurantSchemas = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    full_address: { type: String, required: true },
    photo:{type:String},
    reviewScore:{type:Number, default:0},
    reviews: [reviewSchema]  // Array of reviews
});
const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    full_address: { type: String, required: true },
    photo:{type:String},
    reviews: {
        reviews_count: { type: Number,  }
    }
})
// Create models
const Likedby = mongoose.model("likedby" , LikedBySchema)
const dislikedby = mongoose.model("dislikedby" , DislikedBySchema)
const User = mongoose.model('User', userSchema);
const RestaurantModel = mongoose.model('Restaurant-new', restaurantSchemas);
const Review = mongoose.model('Review', reviewSchema);
const Restaurant = mongoose.model("Restaurant" , restaurantSchema)
module.exports = { User, Restaurant, Review , RestaurantModel , Likedby , dislikedby };
