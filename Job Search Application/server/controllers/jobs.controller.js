const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator");
const Job = require("../model/Job");
const Employer = require("../model/Employer");
const limit_ = 5;

const createJob = catchAsync(async (req, res) => {
     
    console.log('Createe------------------------');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        jobTitle, 
        tasks,
        jobDescription,
        aboutUs,
        jobType,
        expectations,
        languages,
        skills,
        location
    } = req.body;  

    const employerId = req.employer.id; 

    try {
        let job = new Job({
            jobTitle,
            tasks,
            jobDescription,
            aboutUs,
            jobType,
            expectations,
            languages,
            skills,
            employerId, 
            location
        });  
        await job.save(); 
        res.status(200).send("Succesfully created a job!");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
});

const updateJob = catchAsync();

const getAllJobs = catchAsync(async (req, res) => {
    try {
        
        let aggregate_options = [];

        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : limit_;

        const options = {
            page, limit,
            collation: {locale: 'en'},
            customLabels: {
                totalDocs: 'totalResults',
                docs: 'jobs'
            }
        };

        let match = {};

        if (req.query.q) match.jobTitle = {$regex: req.query.q, $options: 'i'};

        aggregate_options.push({$match: match});

        let sortOrder = req.query.sort_order && req.query.sort_order === 'asc' ? 1 : -1;
        aggregate_options.push({$sort: {"createdAt": sortOrder}});

        
        
        aggregate_options.push({$lookup: {from: 'employers', localField: "employerId", foreignField: "_id", as: "employer"}});
        const myAggregate = Job.aggregate(aggregate_options);
        const result = await Job.aggregatePaginate(myAggregate, options);

        res.status(200).json(result);
 
    //   jobs.map(async (job) => {
    //       const employer = await Employer.findById(job.employerId); 
    //       const employerDetails = await employer.find({}).select({ "companyName": 1,"companyLogo": 1, "_id": 0});
    //       console.log(employerDetails.companyLogo);
    //       console.log(employerDetails.companyName); 
    //   })
    // aggregate_options.push({$lookup: {from: 'employers', localField: "_id", foreignField: "employerId", as: "employer"}});
 
    } catch (e) {
      res.send({ message: "Error in Fetching employer" });
    }
  });

const getSingleJobs = catchAsync();

const deleteJob = catchAsync();

module.exports = {
    createJob,
    updateJob,
    getSingleJobs,
    getAllJobs,
    deleteJob 
}