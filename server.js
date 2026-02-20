const express = require("express");
const dotenv = require("dotenv")
const cors=require("cors")
const authRouter = require("./router/authRouter");
const snippetRouter = require("./router/snippetRouter");
const adminRouter = require("./router/adminRouter");
const moderatorRouter = require("./router/morderatorRoutes");
dotenv.config();
const app = express();


app.use(cors())
app.use(express.json());

app.get("/healthz", (req, res) => {
  res.status(200).json({ msg: "Hello from express" })
})

app.use("/api/v1/auth", authRouter)

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