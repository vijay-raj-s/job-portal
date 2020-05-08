const mongoose = require("mongoose");

const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

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
    expectations : [{
        type: String
    }],
    skills : [{
        type: String
    }],
    languages : [{
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
        type: String,
        required: false,
        enum: ['Part-time', 'Full-time','Internship', 'Working student']
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


JobSchema.plugin(aggregatePaginate);

// export model job with JobSchema
module.exports = mongoose.model("job", JobSchema);
