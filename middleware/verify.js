const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
    const token = req.signedCookies.token; // Access the signed cookie
    console.log("JWT Token:", token); // Log the token for debugging

    if (!token) {
        return res.status(400).json({ msg: "Token not found" });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, payload) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(401).json({ msg: "Token is not valid" });
        }

        req.userid = payload; // Attach payload to request
        console.log("Decoded Payload:", payload); // Log the decoded payload for debugging
        next(); // Proceed to the next middleware
    });
};

module.exports = verifytoken;
