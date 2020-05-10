const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator");
const Job = require("../model/Job");
const Employer = require("../model/Employer");
const limit_ = 5;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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
        res.status(200).json({
            message: "Created Job Successfully"
          });
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
  
    } catch (e) {
      res.send({ message: "Error in Fetching employer" });
    }
  });

const getSingleJobs = catchAsync();

const deleteJob = catchAsync();

const getSingleEmployerJobs = catchAsync(async (req, res) => {
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
 
        match.employerId = ObjectId(req.params.id); 
        aggregate_options.push({$match: match});

        let sortOrder = req.query.sort_order && req.query.sort_order === 'asc' ? 1 : -1;
        aggregate_options.push({$sort: {"createdAt": sortOrder}});

        
        
        aggregate_options.push({$lookup: {from: 'employers', localField: "employerId", foreignField: "_id", as: "employer"}});
        const myAggregate = Job.aggregate(aggregate_options);
        const result = await Job.aggregatePaginate(myAggregate, options);

        res.status(200).json(result);
  
    } catch (e) {
      res.send({ message: "Error in Fetching employer" });
    }
  });

module.exports = {
    createJob,
    updateJob,
    getSingleJobs,
    getAllJobs,
    deleteJob,
    getSingleEmployerJobs
}