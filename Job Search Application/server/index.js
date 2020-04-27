const express = require("express");
const bodyParser = require("body-parser");
const jobSeeker = require("./routes/jobSeeker"); 
const employer = require("./routes/employer");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
 
app.use("/jobSeeker", jobSeeker);
app.use("/employer", employer);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
