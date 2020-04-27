const mongoose = require("mongoose");

const JobSeekerSchema = mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true
//   },
//   lastName: {
//     type: String,
//     required: true
//   },
  jobSeekerName : {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// export model jobSeeker with JobSeekerSchema
module.exports = mongoose.model("jobSeeker", JobSeekerSchema);
