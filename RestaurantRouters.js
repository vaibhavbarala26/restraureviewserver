const router = require("express");
// const { Restaurant, RestaurantModel, User } = require("./Model/Restraurant");
// const vader = require('vader-sentiment');
// const haversineDistance = require("./nlp");
// const appRouter = router()
// appRouter.post("/add-hotel", async (req, res) => {
//     const { name, latitude, longitude, full_address } = req.body;
//     const saved = await Restaurant.create({ name, latitude, longitude, full_address })
//     res.status(200).json("saved")
// })
// //66f428f255dcb2f68bc680ac
// appRouter.get("/hotel", async (req, res) => {
//     const { search } = req.body
//     if (!search) {
//         return res.status(400).json("please provide a name to search")
//     }
//     const restaurants = await Restaurant.find({
//         name: { $regex: search, $options: 'i' }
//     });
//     res.status(200).json(restaurants);
// })
// appRouter.post("/hotel-review", async (req, res) => {
//     const { user, review_text, id } = req.body;
//     // Fetch the hotel by ID
//     const hotel = await Restaurant.findById(id);
//     if (!hotel) {
//         return res.status(404).json({ message: "Hotel not found" });
//     }
//     // Log the hotel details for debugging
//     console.log(hotel.name, hotel.latitude, hotel.longitude, hotel.full_address);

//     // Create a review object
//     const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(review_text);
//     var type = "";
//     console.log(intensity.compound);

//     if (intensity.compound >= 0.45) {
//         type = "positive"
//     }
//     else if (intensity.compound <= 0.45 && intensity.compound >= 0) {
//         type = "neutral"
//     }
//     else {
//         type = "negative"
//     }
//     const ids = user.toString();
//     const reviewer = await User.findById(ids)
//     console.log(reviewer);

//     const review = {
//         user: reviewer,
//         user_name: reviewer.name,
//         review_text: review_text,
//         Type: type,
//         date: Date.now(), // Use lowercase 'date' for consistency
//     };
//     // Check if a restaurant already exists with the same coordinates
//     const found = await RestaurantModel.findOne({
//         latitude: hotel.latitude,
//         longitude: hotel.longitude,
//     });
//     if (!found) {
//         // If not found, create a new restaurant entry
//         const saved = await RestaurantModel.create({
//             name: hotel.name,
//             longitude: hotel.longitude,
//             latitude: hotel.latitude,
//             reviews: [review], // Store reviews as an array
//             full_address: hotel.full_address,
//         });
//         return res.status(201).json(saved); // Created response
//     } else {
//         // If found, add the review to the existing restaurant
//         found.reviews.push(review); // Add the new review
//         await found.save(); // Save the updated restaurant
//         return res.status(200).json(found); // Respond with the updated restaurant
//     }
// });
// appRouter.get("/hotel-review", async (req, res) => {
//     const { id } = req.body
//     const found = await RestaurantModel.findById(id)
//     res.status(200).json(found.reviews)
// })
// appRouter.get("/hotel-nearby", async (req, res) => {
//     const { latitude, longitude } = req.body;
//     const newabyhotels = await Restaurant.find();
//     const nearby = allHotels
//         .map(hotel => {
//             const distance = haversineDistance(latitude, longitude, hotel.latitude, hotel.longitude);
//             if (distance <= 7) {
//                 return { hotel, distance: `${distance} km` };
//             }
//         })
//         .filter(Boolean);  // Remove undefined entries

//     res.status(200).json(nearby);

// })
// module.exports = appRouterconst router = require("express");
const { Restaurant, RestaurantModel, User } = require("./Model/Restraurant");
const vader = require('vader-sentiment');
const haversineDistance = require("./nlp");
const verifytoken = require("./middleware/verify");
const appRouter = router()
appRouter.post("/add-hotel", verifytoken, async (req, res) => {
 try{
        const { name, latitude, longitude, full_address  , ratings, review_text , photo , email   } = req.body;
        const found = await RestaurantModel.findOne({ name, latitude, longitude })
        if (found) {
            return res.status(200).json("hotel alreasy exists")
        }
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(review_text);
        let type = "";

        if (intensity.compound >= 0.45) {
            type = "positive";
        } else if (intensity.compound >= 0) {
            type = "neutral";
        } else {
            type = "negative";
        }

        // Fetch the user by email
        const reviewer = await User.findOne({ email });
        if (!reviewer) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Reviewer: ${reviewer.name}, Email: ${email}`);

        // Create the review object
        const review = {
            user: reviewer._id,
            user_name: reviewer.name,
            review_text: review_text,
            Type: type,
            stars: ratings,
            date: new Date(),  // Set current date
        };
        const saved = await RestaurantModel.create({ name, latitude, longitude, full_address , photo , reviews:[review]})
        res.status(200).json("saved")
    }
    catch(e){
        console.log("errors");
        
    }
   
})
//66f428f255dcb2f68bc680ac
appRouter.get("/hotel", async (req, res) => {
    try {
        const { search } = req.query; // Use req.query for GET requests
        if (!search) {
            return res.status(400).json("Please provide a name to search");
        }
        const restaurants = await Restaurant.find({
            name: { $regex: search, $options: 'i' } // Case-insensitive regex search
        });
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels", error });
    }
});

appRouter.post("/hotel-review", verifytoken, async (req, res) => {
    try {
        const { email, review_text, id, stars } = req.body;

        // Input validation (basic check)
        if (!review_text || !stars) {
            return res.status(400).json({ message: "Review text and star rating are required" });
        }

        // Fetch the hotel by ID
        const hotel = await Restaurant.findById(id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        console.log(`Hotel found: ${hotel.name}, Coordinates: (${hotel.latitude}, ${hotel.longitude})`);

        // Perform sentiment analysis on the review text
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(review_text);
        let type = "";

        if (intensity.compound >= 0.45) {
            type = "positive";
        } else if (intensity.compound >= 0) {
            type = "neutral";
        } else {
            type = "negative";
        }

        // Fetch the user by email
        const reviewer = await User.findOne({ email });
        if (!reviewer) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`Reviewer: ${reviewer.name}, Email: ${email}`);

        // Create the review object
        const review = {
            user: reviewer._id,
            user_name: reviewer.name,
            review_text: review_text,
            Type: type,
            stars: stars,
            date: new Date(),  // Set current date
        };
        // Check if the restaurant exists in RestaurantModel based on its coordinates
        const found = await RestaurantModel.findOne({
            latitude: hotel.latitude,
            longitude: hotel.longitude,
        });

        if (!found) {
            // If not found, create a new restaurant entry
            const savedRestaurant = await RestaurantModel.create({
                name: hotel.name,
                longitude: hotel.longitude,
                latitude: hotel.latitude,
                reviews: [review],  // Add the first review
                full_address: hotel.full_address,
                reviewScore: intensity.compound,  // Set initial review score
            });
            return res.status(201).json(savedRestaurant);
        } else {
            // If restaurant found, update the review score and add the new review
            const totalLength = found.reviews.length;
            const totalScore = found.reviewScore * totalLength;
            const finalScore = (totalScore + intensity.compound) / (totalLength + 1);

            // Add the new review and update review score
            found.reviews.push(review);
            found.reviewScore = finalScore;
            await found.save();  // Save the updated restaurant document

            return res.status(200).json(found);  // Respond with the updated restaurant
        }
    } catch (error) {
        console.error("Error posting hotel review:", error);
        res.status(500).json({ message: "Server error, please try again later.", error });
    }
});

appRouter.get("/hotel-review",   async (req, res) => {
    try {
        const { latitude, longitude } = req.body
        const found = await RestaurantModel.findOne({ latitude, longitude })
        res.status(200).json(found.reviews)
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
})

appRouter.get("/hotel-nearby", async (req, res) => {
    try {
        // Extract latitude and longitude from query parameters
        const { latitude, longitude } = req.query;

        // Check if latitude and longitude are provided
        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Latitude and longitude are required" });
        }

        // Fetch all restaurants or hotels from the database
        const nearbyHotels = await Restaurant.find();

        // Calculate the distance for each hotel and filter those within 7 km
        const nearby = nearbyHotels
            .map(hotel => {
                const distance = haversineDistance(parseFloat(latitude), parseFloat(longitude), hotel.latitude, hotel.longitude);
                if (distance <= 2 ) {
                    return { hotel};
                }
            })
            .filter(Boolean);  // Remove undefined entries (hotels farther than 7 km)

        res.status(200).json(nearby);
    } catch (error) {
        res.status(500).json({ message: "Error fetching nearby hotels", error });
    }
});
appRouter.get("/newhotel" , async(req , res)=>{
    const {id} = req.query;
    console.log(id);
    
    const foundhtel = await Restaurant.findById(id)
    console.log(foundhtel);
    
    const rest = await RestaurantModel.findOne({latitude : foundhtel.latitude , longitude:foundhtel.longitude})
   if(!rest){
    const savedrest = await RestaurantModel.create({name:foundhtel.name , latitude:foundhtel.latitude , longitude:foundhtel.longitude , full_address:foundhtel.full_address , photo:foundhtel.photo})
    return res.status(200).json(savedrest)
   }
    return res.status(200).json(rest)
})
appRouter.get("/hotels" , async(req , res)=>{
    const {id} = req.query;
    console.log(id);
    const foundhtel = await RestaurantModel.findById(id)
   if(!foundhtel){
    const savedrest = await RestaurantModel.create({name:foundhtel.name , latitude:foundhtel.latitude , longitude:foundhtel.longitude , full_address:foundhtel.full_address , photo:foundhtel.photo})
    return res.status(200).json(savedrest)
   }
    return res.status(200).json(foundhtel)
})
appRouter.put("/like", verifytoken, async (req, res) => {
    const { response, id, review_id, email } = req.body;
    try {
        // Find the restaurant by ID
        const found = await Restaurant.findById(id);
        const foundsi = await RestaurantModel.findById(id);
        if (!found && !foundsi) {
            return res.status(404).json({ message: "Restaurant not found." });
        }

        // Find the restaurant model based on latitude and longitude
        const founds = await RestaurantModel.findOne({
            latitude: found?.latitude || foundsi?.latitude,
            longitude: found?.longitude || foundsi?.longitude,
        });

        if (!founds) {
            return res.status(404).json({ message: "Restaurant model not found." });
        }

        // Find user by email to get the ObjectId
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Find the review by its ID
        for (const review of founds.reviews) {
            if (review._id.toString() === review_id) {
                if (response === 'like') {
                    // Check if the user has already liked the review
                    const alreadyLiked = review.likedBy.some((u) => u?.toString() === user._id.toString());
                    if (alreadyLiked) {
                        // If user already liked, remove like and user from likedBy array
                        review.likes -= 1;
                        review.likedBy = review.likedBy.filter((u) => u?.toString() !== user._id.toString());
                    } else {
                        // Increment like and add user to likedBy array
                        review.likes += 1;
                        review.likedBy.push(user._id); // Push ObjectId, not email

                        // If user had disliked it before, remove their dislike
                        const alreadyDisliked = review.dislikedBy.some((u) => u?.toString() === user._id.toString());
                        if (alreadyDisliked) {
                            review.disliked -= 1;
                            review.dislikedBy = review.dislikedBy.filter((u) => u?.toString() !== user._id.toString());
                        }
                    }
                } else if (response === 'dislike') {
                    // Check if the user has already disliked the review
                    const alreadyDisliked = review.dislikedBy.some((u) => u?.toString() === user._id.toString());
                    if (alreadyDisliked) {
                        // If user already disliked, remove dislike and user from dislikedBy array
                        review.disliked -= 1;
                        review.dislikedBy = review.dislikedBy.filter((u) => u?.toString() !== user._id.toString());
                    } else {
                        // Increment dislike and add user to dislikedBy array
                        review.disliked += 1;
                        review.dislikedBy.push(user._id); // Push ObjectId, not email

                        // If user had liked it before, remove their like
                        const alreadyLiked = review.likedBy.some((u) => u?.toString() === user._id.toString());
                        if (alreadyLiked) {
                            review.likes -= 1;
                            review.likedBy = review.likedBy.filter((u) => u?.toString() !== user._id.toString());
                        }
                    }
                }

                // Save the updated restaurant model
                await founds.save();
                return res.status(200).json({ message: "Review updated successfully.", review , user:req.userid });
            }
        }

        return res.status(404).json({ message: "Review not found." });
    } catch (error) {
        console.error("Error updating review:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
appRouter.get("/top-nearby", async (req, res) => {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    try {
        const nearbyHotels = await RestaurantModel.find();
        const nearby = nearbyHotels
            .map((hotel) => {
                const distance = haversineDistance(parseFloat(latitude), parseFloat(longitude), hotel.latitude, hotel.longitude);
                if (distance <= 2) {
                    return hotel;
                }
            })
            .filter(Boolean); // Filter out undefined values

        // Sort by reviewScore in descending order (highest scores first)
        nearby.sort((a, b) => b.reviewScore - a.reviewScore);

        // Get the top 15 hotels
        const top15Nearby = nearby.slice(0, 15);

        return res.status(200).json(top15Nearby);
    } catch (error) {
        console.error("Error fetching nearby hotels:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = appRouter
 