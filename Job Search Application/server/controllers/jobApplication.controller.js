const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator"); 
const JobSeeker = require("../model/JobSeeker");
const JobApplication = require("../model/Application"); 
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const neo4j = require("../config/neo_db");
const _limit = 50;


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
      match.employerId = ObjectId(req.employer.id);
      
      if(req.query.jobId){
        match.jobId = ObjectId(req.query.jobId);
      }

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
      console.log(e);
      res.send({ message: "Error in Fetching Applications" });
    }
  });

const getAllJobApplications = catchAsync(async (req, res) => {
  try {
      
    let aggregate_options = [];

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 50;

    const options = {
        page, limit,
        collation: {locale: 'en'},
        customLabels: {
            totalDocs: 'totalResults',
            docs: 'jobApplications'
        }
    };

    let match = {};
 
    if(req.query.jobId){
      match.jobId = ObjectId(req.query.jobId);
    }

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
    console.log(e);
    res.send({ message: "Error in creating nodes" });
  }
});

const createNodesForRecommendation = catchAsync ( async(req,res) => {

    const session = neo4j.driver.session();
    const url = 'http://localhost:4000/application/getAllApplications';
    const token = req.headers.token;
    const cypher = `// Creating graph  
                    WITH '${url}' AS uri
                    CALL apoc.load.jsonParams(uri, {token: '${token}' }, null)
                    YIELD value
                    WITH value.jobApplications as applications 
                    UNWIND applications as application 
                    MERGE (j:Job {name: application.job[0].jobTitle, jobId: application.job[0]._id }) 
                    MERGE (l:Location {name: coalesce(application.job[0].location, "unknown")})
                    MERGE (jt:JobType {name: coalesce(application.job[0].jobType, "unknown")})
                    MERGE (js:JobSeeker {name:application.jobSeeker[0].jobSeekerName, jobseekerId: application.jobSeeker[0]._id})
                    MERGE (exp:Experience {name: coalesce(application.jobSeeker[0].experience, "unknown")})
                    MERGE (jst:JobType {name: coalesce(application.jobSeeker[0].jobType, "unknown")})
                    MERGE (jsl:Location {name: coalesce(application.jobSeeker[0].location, "unknown")})
                    MERGE (des:Designation {name: coalesce(application.jobSeeker[0].designation, "unknown")})
                    
                    MERGE (js)-[:HAS_APPLIED_FOR]->(j)
                    MERGE (js)-[:HAS_EXPERIENCE]->(exp)
                    MERGE (js)-[:HAS_DESIGNATION]->(des)
                    MERGE (j)-[:HAS_JOB_TYPE]->(jt)
                    MERGE (js)-[:WANTS_JOB_TYPE]->(jst)
                    MERGE (js)-[:LIVES_IN]->(jsl)
                    MERGE (j)-[:LOCATED_IN]->(l)`;
               
      session.run(cypher)
        .then(result => { 
          const cypher = `// creating skills 
                          WITH '${url}' AS uri
                          CALL apoc.load.jsonParams(uri, {token: '${token}' }, null)
                          YIELD value
                          WITH value.jobApplications as applications 
                          UNWIND applications as application  
                          UNWIND application.jobSeeker as jobSeeker 
                          MATCH (js:JobSeeker {name: jobSeeker.jobSeekerName }) 

                          WITH jobSeeker, js
                          UNWIND jobSeeker.skills as skill
                          MERGE (sk:Skills {name:toLower(skill)})
                          MERGE (js)-[:HAS_SKILL]->(sk)`;
                          
            session.run(cypher)
              .then(result => { 
                res.status(200).json({ "message": "Successfully created nodes" });
            }).catch(e => {
              console.log(e);
            })
            .then(() => {
              return session.close();
            });
      }).catch(e => {
        console.log(e);
      })
})

const createBestFitGraph = catchAsync( async (req, res) => {
  const session = neo4j.driver.session();

  const url = `http://localhost:4000/application/getApplications?jobId=${req.query.jobId}`;
  const token = req.headers.token;
  const cypher = `// Creating graph  
                  WITH '${url}' AS uri
                  CALL apoc.load.jsonParams(uri, {token: '${token}' }, null)
                  YIELD value
                  WITH value.jobApplications as applications 
                  UNWIND applications as application 
                  MERGE (j:Job {name: application.job[0].jobTitle, jobId: application.job[0]._id }) 
                  MERGE (l:Location {name: coalesce(application.job[0].location, "unknown")})
                  MERGE (jt:JobType {name: coalesce(application.job[0].jobType, "unknown")})
                  MERGE (js:JobSeeker {name:application.jobSeeker[0].jobSeekerName, jobseekerId: application.jobSeeker[0]._id})
                  MERGE (exp:Experience {name: coalesce(application.jobSeeker[0].experience, "unknown")})
                  MERGE (jst:JobType {name: coalesce(application.jobSeeker[0].jobType, "unknown")})
                  MERGE (jsl:Location {name: coalesce(application.jobSeeker[0].location, "unknown")})
                  MERGE (des:Designation {name: coalesce(application.jobSeeker[0].designation, "unknown")})
                  
                  MERGE (js)-[:HAS_APPLIED_FOR]->(j)
                  MERGE (js)-[:HAS_EXPERIENCE]->(exp)
                  MERGE (js)-[:HAS_DESIGNATION]->(des)
                  MERGE (j)-[:HAS_JOB_TYPE]->(jt)
                  MERGE (js)-[:WANTS_JOB_TYPE]->(jst)
                  MERGE (js)-[:LIVES_IN]->(jsl)
                  MERGE (j)-[:LOCATED_IN]->(l)`;
             
    let result = await session.run(cypher);
    console.log("request to create");
    if(result){
      console.log("Created nodes successfully");
      console.log(result);
      const jsskCypher = `// creating skills 
                          WITH '${url}' AS uri
                          CALL apoc.load.jsonParams(uri, {token: '${token}' }, null)
                          YIELD value
                          WITH value.jobApplications as applications 
                          UNWIND applications as application   
                          MATCH (js:JobSeeker {name: application.jobSeeker[0].jobSeekerName }) 
                          UNWIND application.jobSeeker[0].skills as skill
                          MERGE (sk:Skills {name:toLower(skill)})
                          MERGE (js)-[:HAS_SKILL]->(sk)`;
                          
      let jsskResult = await session.run(jsskCypher);
      if(jsskResult){  
        console.log("Added skills for js");
      }

      const jskCypher = `// creating skills 
                          WITH '${url}' AS uri
                          CALL apoc.load.jsonParams(uri, {token: '${token}' }, null)
                          YIELD value
                          WITH value.jobApplications as applications 
                          UNWIND applications as application   
                          MATCH (j:Job) 
                          UNWIND application.job[0].skills as skill
                          MERGE (sk:Skills {name:toLower(skill)})
                          MERGE (j)-[:REQUIRES_SKILL]->(sk)`;
                          
      let jskResult = await session.run(jskCypher);
      if(jskResult){  
        console.log("Added skill requirements");
      }



      const jslCypher = `// creating languages 
                      WITH '${url}' AS uri
                      CALL apoc.load.jsonParams(uri, {token: '${token}' }, null)
                      YIELD value
                      WITH value.jobApplications as applications 
                      UNWIND applications as application   
                      MATCH (js:JobSeeker{name: application.jobSeeker[0].jobSeekerName}) 
                      UNWIND application.jobSeeker[0].languages as language
                      MERGE (la:Language {name:toLower(language)})
                      MERGE (js)-[:KNOWS_LANGUAGE]->(la)`;
                      
      let jslResult = await session.run(jslCypher);
      if(jslResult){ 
        console.log("Added Languages successfully"); 
      }

      const jlCypher = `// creating languages requirement
                      WITH '${url}' AS uri
                      CALL apoc.load.jsonParams(uri, {token: '${token}' }, null)
                      YIELD value
                      WITH value.jobApplications as applications 
                      UNWIND applications as application   
                      MATCH (j:Job) 
                      UNWIND application.job[0].languages as language
                      MERGE (la:Language {name:toLower(language)})
                      MERGE (j)-[:REQUIRES_LANGUAGE]->(la)`;
                      
      let jlResult = await session.run(jlCypher);
      if(jlResult){ 
        console.log("Added Languages successfully"); 
      }

      const skillMatch = `MATCH (j:Job)-[:REQUIRES_SKILL]->(sk:Skills)<-[:HAS_SKILL]-(js:JobSeeker)
                          WITH COUNT(sk) as SkillMatches,js
                          MERGE (skm:SkillMatch{name:SkillMatches})
                          MERGE (js)-[:HAS_MATCHING_SKILLS]->(skm)`;
                      
      let skillMatchResult = await session.run(skillMatch);
      if(skillMatchResult){ 
        console.log("Added skill match successfully"); 
      }

      const locationMatch = `MATCH (j:Job)-[:LOCATED_IN]->(l:Location)<-[:LIVES_IN]-(js:JobSeeker)
                          WITH COUNT(l) as LocationMatches,js
                          MERGE (lm:LocationMatch{name:LocationMatches})
                          MERGE (js)-[:HAS_MATCHING_LOCATION]->(lm)`;
                      
      let locationMatchResult = await session.run(locationMatch);
      if(locationMatchResult){ 
        console.log("Added location Match successfully"); 
      }

      const jobTypeMatch = `MATCH (j:Job)-[:WANTS_JOB_TYPE]->(jt:JobType)<-[:HAS_JOB_TYPE]-(js)
                            WITH COUNT(jt) as JobTypeMatches,js
                            MERGE (jtm:JobTypeMatch{name:JobTypeMatches})
                            MERGE (js)-[:HAS_MATCHING_JOBTYPE]->(jtm)`;
                      
      let jobTypeMatchResult = await session.run(jobTypeMatch);
      if(jobTypeMatchResult){ 
        console.log("Added jobType Match successfully"); 
      }

      const LanguageMatch = `MATCH (j:Job)-[:REQUIRES_LANGUAGE]->(la:Language)<-[:KNOWS_LANGUAGE]-(js:JobSeeker)
                            WITH COUNT(la) as LanguageMatches,js
                            MERGE (jlm:LanguageMatch{name:LanguageMatches})
                            MERGE (js)-[:HAS_MATCHING_LANGUAGE]->(jlm)`;
                      
      let LanguageMatchResult = await session.run(LanguageMatch);
      if(LanguageMatchResult){ 
        console.log("Added jobType Match successfully"); 
      }
 
      res.status(200).json({ "message": "Successfully created nodes" });
     
    }
    
     
});

const getBestFit = catchAsync( async(req,res) => {
      console.log("Inside best fit");
      const session = neo4j.driver.session()
      const cypher = `// BEST FIT REC..
                      MATCH (js:JobSeeker)
                      OPTIONAL MATCH (js)-[:HAS_MATCHING_SKILLS]->(sk:SkillMatch)
                      OPTIONAL MATCH (js)-[:HAS_MATCHING_LANGUAGE]->(l:LanguageMatch)
                      OPTIONAL MATCH (js)-[:HAS_MATCHING_LOCATION]->(lo:LocationMatch)
                      OPTIONAL MATCH (js)-[:HAS_EXPERIENCE]->(exp:Experience)
                      RETURN js.name AS JobseekerName,  coalesce(sk.name, 0) as SkillsMatched, coalesce(l.name, 0) as LanguageMatched, coalesce(lo.name, 0) as LocationMatched, exp.name as Experience, (3 * coalesce(sk.name, 0) + exp.name + (2 * coalesce(lo.name, 0))  + coalesce(l.name, 0)) as TotalScore
                      ORDER BY TotalScore DESC`;
      session.run(cypher)
        .then(result => { 
          let response = [];
          console.log(result);
          result.records.map( record => { 
            console.log(record._fields);
            console.log(record.keys);
            let obj = {}
            for( let i = 0; i < record.keys.length; i++){ 
              obj[record.keys[i]] = record._fields[i].low != null ? record._fields[i].low : record._fields[i];  
            }
            response.push(obj);
          });
          res.status(200).json({ response });
      }).catch(e => {
        console.log(e);
      })
      .then(() => {
        return session.close();
      });
});

const deleteAllNodes = catchAsync( async(req,res)=>{
  const session = neo4j.driver.session()
      const cypher = `MATCH (n) DETACH DELETE n`;
      session.run(cypher)
        .then(result => { 
          res.status(200).json({ message: "deleted all nodes succesfully" });
      }).catch(e => {
        console.log(e);
      })
      .then(() => {
        return session.close();
      });
});
 
module.exports = {
    getApplications,
    applyJob,
    getAllJobApplications,
    createBestFitGraph,
    createNodesForRecommendation,
    getBestFit,
    deleteAllNodes
}