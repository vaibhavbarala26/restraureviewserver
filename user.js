const express = require('express');
const { User } = require('./Model/Restraurant');
const jwt = require("jsonwebtoken");
const routeruser = express.Router();

// User login or registration route
routeruser.post("/", async (req, res) => {
    const { name, email } = req.body;

    // Clear the old cookie if exists
    res.clearCookie("token", { path: "/", domain: ".vercel.app", httpOnly: true, signed: true });

    try {
        // Find user in the database
        const found = await User.findOne({ email });
        const expires = new Date();
        expires.setDate(expires.getDate() + 7); // Set token expiry for 7 days

        if (found) {
            // If user is found, generate a new token
            const payload = { id: found._id, email: found.email };
            const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '7d' });

            // Set the token in an HTTP-only cookie
            res.cookie("token", token, {
                path: "/",
                domain: ".vercel.app",  // Allow cookies for all subdomains
                httpOnly: true,
                signed: true,
                expires: expires,
            });

            // Respond with a success message
            return res.status(200).json({ msg: "User successfully logged in", user: found });
        } else {
            // If user is not found, create a new user
            const saved = await User.create({ name, email });
            
            // Generate a token for the new user
            const payload = { id: saved._id, email: saved.email };
            const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '7d' });

            // Set the token in an HTTP-only cookie
            res.cookie("token", token, {
                path: "/",
                domain: ".vercel.app",  // Allow cookies for all subdomains
                httpOnly: true,
                signed: true,
                expires: expires,
            });

            // Respond with a success message for the new user
            return res.status(200).json({ msg: "User successfully registered", user: saved });
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).json({ msg: "Server error, please try again later." });
    }
});

module.exports = routeruser;
