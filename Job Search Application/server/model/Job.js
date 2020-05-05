const mongoose = require("mongoose");

const JobType = mongoose.Schema({
    name : {
        type: String,
        required: true
    }
});

const JobSchema = mongoose.Schema({
    jobTitle : {
        type: String,
        required: true
    },
    employerId : {
        type: mongoose.ObjectId,
        required: true
    },
    tasks : [{
        type: String
    }],
    jobDescription : {
        type: String,
        required: false
    },
    aboutUs : {
        type: String,
        required: false
    },
    jobType : {
        type: JobType,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    companyUrl: {
        type: String,
        required: false
    },
    companyLogo: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// export model job with JobSchema
module.exports = mongoose.model("job", JobSchema);
