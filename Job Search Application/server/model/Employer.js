const mongoose = require("mongoose");

const EmployerSchema = mongoose.Schema({
  employerName: {
    type: String,
    required: true
  }, 
  companyURL: {
    type: String,
    required: false
  },
  companyName: {
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

// export model employer with EmployerSchema
module.exports = mongoose.model("employer", EmployerSchema);
