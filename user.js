const express = require('express');
const { User } = require('./Model/Restraurant');
const routeruser = express.Router();
const jwt = require("jsonwebtoken");
// "msg": "User successfully registered",
// "user": {
//   "name": "name1",
//   "email": "22je1042.iitism.ac.in",
//   "_id": "66fc8327d0c1508edba5b772",
//   "__v": 0
// }

// User login or registration route
routeruser.post("/", async (req, res) => {
  
    const { name, email } = req.body;

    // Clear the old cookie if exists
    res.clearCookie("token", { path: "/", domain: "localhost", httpOnly: true, signed: true });

    // Find user in the database
    const found = await User.findOne({ email });
    
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // Set token expiry for 7 days

    if (found) {
      // If user is found, generate a new token
      const payload = { id: found._id, email: found.email };  // Use only necessary data in the token payload
      const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '7d' });

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        signed: true,
        expires: expires,
      });

      // Respond with a success message
      res.status(200).json({ msg: "User successfully logged in", user: found });
    } else {
      // If user is not found, create a new user
      const saved = await User.create({ name, email });
      
      // Generate a token for the new user
      const payload = { id: saved._id, email: saved.email };
      const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: '7d' });

      // Set the token in an HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        signed: true,
        expires: expires,
      });

      // Respond with a success message for the new user
      res.status(200).json({ msg: "User successfully registered", user: saved });
    }
  
});

module.exports = routeruser;
