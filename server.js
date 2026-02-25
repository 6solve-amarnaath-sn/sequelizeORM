const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit=require("express-rate-limit");
const authRouter = require("./router/authRouter");
const snippetRouter = require("./router/snippetRouter");
const adminRouter = require("./router/adminRouter");
const moderatorRouter = require("./router/morderatorRoutes");
dotenv.config();
const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many API requests. Please try again later."
  }
});

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, 
  message: {
    status: 429,
    message: "Too many login attempts. Try again in 10 minutes."
  }
});

app.use(cors())
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({ msg: "Hello from express" })
})
app.use(apiLimiter);

app.use("/api/v1/auth",loginLimiter, authRouter)

app.use("/api/v1/snippet", snippetRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/moderator", moderatorRouter);


app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: err.errors[0].message
    });
  }

  res.status(500).json({
    message: 'Internal Server Error'
  });
});


app.listen(5000, () => {
  console.log("server is running")
})