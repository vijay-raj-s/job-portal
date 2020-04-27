const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const JobSeeker = require("../model/JobSeeker");

 
router.post(
    "/signup",
    [
        check("jobSeekerName", "Please Enter a Valid JobSeekername")
        .not()
        .isEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ],
    async (req, res) => {
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
    }
);



router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ],
    async (req, res) => {
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
              token
            });
          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );

  router.get("/details", auth, async (req, res) => {
    try {
      // request.jobSeeker is getting fetched from Middleware after token authentication
      const jobSeeker = await JobSeeker.findById(req.jobSeeker.id);
      res.json(jobSeeker);
    } catch (e) {
      res.send({ message: "Error in Fetching jobSeeker" });
    }
  });

module.exports = router;
