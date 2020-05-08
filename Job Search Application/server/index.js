const express = require("express");
const bodyParser = require("body-parser");
const jobSeeker = require("./routes/jobSeeker"); 
const jobs = require("./routes/jobs");
const application = require("./routes/application");
const employer = require("./routes/employer");
const InitiateMongoServer = require("./config/db");
var multer = require('multer');

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});
 
app.use("/jobseeker", jobSeeker);
app.use("/employer", employer);
app.use("/jobs",jobs)
app.use("/application",application);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
