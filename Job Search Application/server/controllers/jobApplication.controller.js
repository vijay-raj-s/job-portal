const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator"); 
const JobSeeker = require("../model/JobSeeker");
const JobApplication = require("../model/Application"); 

const _limit = 5;


const applyJob = catchAsync(async (req, res) => {
    //Getting job details from client
    const {
        jobId,
        employerId
    } = req.body;
    const jobSeekerId = req.jobSeeker.id;

    try {

        const application = await JobApplication.findOne({
            jobId,
            jobSeekerId
        });
        if (application)
        return res.status(400).json({
          message: "Already Applied"
        });

        
        let jobApplication = new JobApplication({
            jobId : jobId,
            employerId: employerId,
            status: 'pending',
            jobSeekerId: req.jobSeeker.id
        });   
        await jobApplication.save(); 
        res.status(200).json({ message: "Succesfully applied for the job!"});
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving job application");
    }
});

const updateJob = catchAsync();

const getApplications = catchAsync(async (req, res) => {
    try {
      
      let aggregate_options = [];

      let page = req.query.page ? parseInt(req.query.page) : 1;
      let limit = req.query.limit ? parseInt(req.query.limit) : _limit;

      const options = {
          page, limit,
          collation: {locale: 'en'},
          customLabels: {
              totalDocs: 'totalResults',
              docs: 'jobApplications'
          }
      };

      let match = {};

      // if (req.query.q) match.jobTitle = {$regex: req.query.q, $options: 'i'};
      match.employerId = req.employer.id;
      aggregate_options.push({$match: match});

      let sortOrder = req.query.sort_order && req.query.sort_order === 'asc' ? 1 : -1;
      aggregate_options.push({$sort: {"createdAt": sortOrder}});
      console.log('order');
      aggregate_options.push({$lookup: {from: 'jobseekers', localField: "jobSeekerId", foreignField: "_id", as: "jobSeeker"}});
      aggregate_options.push({$lookup: {from: 'jobs', localField: "jobId", foreignField: "_id", as: "job"}});
      
      const myAggregate = JobApplication.aggregate(aggregate_options);
      
      const result = await JobApplication.aggregatePaginate(myAggregate, options); 
      
      res.status(200).json(result); 
    } catch (e) {
      res.send({ message: "Error in Fetching Applications" });
    }
  });

const changeStatus = catchAsync();

const getSingleApplication = catchAsync();
 
module.exports = {
    getApplications,
    getSingleApplication,
    applyJob,
    changeStatus
}