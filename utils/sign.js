const jwt = require("jsonwebtoken")



async function genToken(payload) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.log("please check jwt secret")
    }
    return jwt.sign(payload, jwtSecret, { expiresIn: "1d" })
}

module.exports = genToken;