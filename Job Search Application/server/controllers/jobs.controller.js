const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator");
const Job = require("../model/Job");
const Employer = require("../model/Employer");
const multer = require('multer');

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
    const employerFromDb = await Employer.findById(req.employer.id);
    const companyLogo = employerFromDb.companyLogo;
    const companyUrl = employerFromDb.companyUrl;

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
            companyUrl,
            companyLogo,
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
      // request.employer is getting fetched from Middleware after token authentication
      const jobs = await Job.find();
      res.json(jobs);
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