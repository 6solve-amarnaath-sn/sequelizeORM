const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.log("please check jwt")
    }
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(" ")[1];
    try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

}

module.exports= verify