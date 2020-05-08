
const mongoose = require("mongoose");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
 

const JobApplicationSchema = mongoose.Schema({
    jobId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    employerId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    jobSeekerId: {
        type: mongoose.Schema.Types.ObjectId, 
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
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


JobApplicationSchema.plugin(aggregatePaginate);
// export model jobApplication with JobApplicationSchema
module.exports = mongoose.model("jobApplication", JobApplicationSchema);
