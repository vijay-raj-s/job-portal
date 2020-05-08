const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator");
const Employer = require("../model/Employer");
const JobSeeker = require("../model/JobSeeker");
const JobApplication = require("../model/Application");
const multer = require('multer');

const applyJob = catchAsync(async (req, res) => {
    //Getting job details from client
    const {
        jobId,
        employerId
    } = req.body;
    const jobSeeker = await JobSeeker.findById(req.jobSeeker.id);

    try {

        const application = await JobApplication.findOne({
            jobId,
            jobSeeker
        });
        if (application)
        return res.status(400).json({
          message: "Already Applied"
        });

        
        let jobApplication = new JobApplication({
            jobId : jobId,
            employerId: employerId,
            status: 'pending',
            jobSeeker: jobSeeker,
            jobSeekerName: jobSeeker.jobSeekerName,
            designation: jobSeeker.designation,
            email: jobSeeker.email
        });  
        //jobApplication.populate('jobSeeker', '-password'); 
        await jobApplication.save(); 
        res.status(200).send("Succesfully applied for the job!");
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving job application");
    }
});

const updateJob = catchAsync();

const getApplications = catchAsync(async (req, res) => {
    try {
      // request.employer is getting fetched from Middleware after token authentication
      const jobs = await JobApplication.find();
      const jobSeeker = await JobSeeker.findById();
      res.json(jobs);
    } catch (e) {
      res.send({ message: "Error in Fetching Applications" });
    }
  });

const changeStatus = catchAsync();
 
module.exports = {
    getApplications,
    applyJob,
    changeStatus
}