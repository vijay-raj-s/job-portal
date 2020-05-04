const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator");
const JobSeeker = require("../model/JobSeeker");


const signUp = catchAsync(async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        jobSeekerName,
        email,
        password
    } = req.body;
    try {
        let jobSeeker = await JobSeeker.findOne({
            email
        });
        if (jobSeeker) {
            return res.status(400).json({
                msg: "JobSeeker Already Exists"
            });
        }

        jobSeeker = new JobSeeker({
            jobSeekerName,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        jobSeeker.password = await bcrypt.hash(password, salt);

        await jobSeeker.save();

        const payload = {
            jobSeeker: {
                id: jobSeeker.id
            }
        };

        jwt.sign(
            payload,
            "randomString", {
                expiresIn: 10000
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token
                });
            }
        );
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
    }
}); 
 
const login = catchAsync(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let jobSeeker = await JobSeeker.findOne({
        email
      });
      if (!jobSeeker)
        return res.status(400).json({
          message: "JobSeeker Not Exist"
        });

      const isMatch = await bcrypt.compare(password, jobSeeker.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        jobSeeker: {
          id: jobSeeker.id
        }
      };

      jwt.sign(
        payload,
        "secret",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            "token" : token,
            "id" : jobSeeker.id
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }); 

const getDetails = catchAsync(async (req, res) => {
    try {
      const jobSeeker = await JobSeeker.findById(req.jobSeeker.id);
      res.json(jobSeeker);
    } catch (e) {
      res.send({ message: "Error in Fetching jobSeeker" });
    }
  }); 

const updateAccount = catchAsync(); 



module.exports = {
    signUp,
    login,
    getDetails,
    updateAccount
}