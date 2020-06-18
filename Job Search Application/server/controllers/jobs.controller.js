const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator");
const Job = require("../model/Job");
const Employer = require("../model/Employer");
const limit_ = 5;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const redisClient = require("../config/redis");

var redis = require('redis');
var client = redis.createClient();

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

const updateJob = catchAsync(async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    } 

    const jobId = ObjectId(req.params.id);
    let currentJob = await Job.findById(jobId);
    try {
        currentJob.jobTitle = req.body.jobTitle;
        currentJob.jobType = req.body.jobType;
        currentJob.location = req.body.location;
        currentJob.jobDescription = req.body.jobDescription;
        currentJob.skills = req.body.skills;
        currentJob.languages = req.body.languages;
        currentJob.expectations = req.body.expectations;
        currentJob.tasks = req.body.tasks;
        currentJob.aboutUs = req.body.aboutUs;
    
        await currentJob.save(); 
        res.status(200).json({
            message: "Created Job Successfully"
          });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
});

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

const deleteJob = catchAsync(
    async (req, res) => {
        const employerId = req.employer.id;
        const jobId = req.params.id;
        try{
            const job = await Job.findById(jobId);
            if(!job){
                res.status(400).json({
                    message: "No jobs found"
                })
            }
            await job.remove();
            res.status(200).json({
                message: "successfully deleted Job!"
            })

        }catch(e){
            console.log(err.message);
             res.status(500).send("Error in Saving");
        }
    }
);

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

const saveJob = catchAsync( async(req,res) => {
    let jobSeekerId = req.jobSeeker.id;
    let jobId = req.query.jobId;
    let job = await Job.findById(jobId);
    if (!job)
        return res.status(400).json({
          message: "job does Not Exist"
        });     

    let savedJob; 
    let alreadySaved;
    client.get(jobSeekerId, function(err, reply) {
        if(err){
            console.log(err);
            res.send({ message: "Error in getting saved jobs" });
        } 
        savedJob = JSON.parse(reply);  
        let jobs = [];
        if(savedJob){
            console.log(savedJob);
            savedJob.map(job => {
                if(job._id === jobId){
                    alreadySaved = true;
                } 
            });
            jobs.push(...savedJob);

        }
        
        if(alreadySaved){
            res.status(200).json({message: "Already saved this job"})  
        }else{
            jobs.push(job);  
            jobString = JSON.stringify(jobs);
            client.set(jobSeekerId, jobString, function (err, reply){
                if(err){
                    console.log("error setting jobs in redis")
                }
                console.log("successfully set");
                res.status(200).send("Succesfully saved job to redis")
            }); 
        }
        
        
    });
    
     
});

const getSavedJobs = catchAsync( async(req,res) => {
    let jobSeekerId = req.jobSeeker.id; 
    client.get(jobSeekerId, function(err, reply) {
        if(err){
            console.log(err);
            res.send({ message: "Error in getting saved jobs" });
        } 
        let savedJob = JSON.parse(reply); 
        res.status(200).json(savedJob);
    });
    
});

module.exports = {
    createJob,
    updateJob,
    getSingleJobs,
    getAllJobs,
    deleteJob,
    getSingleEmployerJobs,
    saveJob,
    getSavedJobs
}