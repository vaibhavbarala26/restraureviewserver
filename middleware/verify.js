const jwt = require("jsonwebtoken")
const verifytoken = (req, res, next) => {
    const token = req.signedCookies.token
    console.log(token);
    try {
        if (!token) return res.status(400).json({ msg: "Not found" })
        jwt.verify(token, process.env.SECRET_TOKEN_KEY, async (err, payload) => {
            if (err) return res.status(401).json({ msg: "token is not valid" })
            req.userid = payload;
        console.log(payload);
            next();
        })
    }
    catch (e) {

    }
}
module.exports = verifytoken