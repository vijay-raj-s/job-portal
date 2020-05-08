
const mongoose = require("mongoose");

const JobSeekerSchema = require("../model/JobSeeker");

const JobApplicationSchema = mongoose.Schema({
    jobId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    employerId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            "pending",
            "approved",
            "rejected"
        ]
    },
    designation: {
        type: String,
        required: false
    },
    jobSeekerName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// export model jobApplication with JobApplicationSchema
module.exports = mongoose.model("jobApplication", JobApplicationSchema);
