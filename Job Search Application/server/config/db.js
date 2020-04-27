const mongoose = require("mongoose");

// Replace this with your MONGOURI.
const MONGOURI = "mongodb+srv://dbUser:theblues29@personal-cluster-aokmr.mongodb.net/job_search_db?retryWrites=true&w=majority";

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;