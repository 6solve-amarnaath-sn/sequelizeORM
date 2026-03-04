const jwt = require("jsonwebtoken");

const verify = async (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.log("please check jwt")
  }
  const authHeader = req.headers.authorization;
 // const cookieToken = req.cookies.access_token;
  if (!authHeader || !authHeader.startsWith('Bearer ') /*&& !cookieToken*/) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const token = /*cookieToken ? cookieToken :*/ authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }

}

module.exports = verify