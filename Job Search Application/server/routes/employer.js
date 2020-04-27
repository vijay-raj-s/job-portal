const express = require("express");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth");
const Employer = require("../model/Employer");


 
router.post(
    "/signup",
    [
        check("employerName", "Please Enter a Valid Employername")
        .not()
        .isEmpty(),
        check("companyName", "Please Enter a Valid Company Name")
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
            employerName,
            email,
            companyName,
            password
        } = req.body;
        try {
            let employer = await Employer.findOne({
                email
            });
            if (employer) {
                return res.status(400).json({
                    msg: "Employer Already Exists"
                });
            }

            employer = new Employer({
                employerName,
                email,
                companyName,
                password
            });

            const salt = await bcrypt.genSalt(10);
            employer.password = await bcrypt.hash(password, salt);

            await employer.save();

            const payload = {
                employer: {
                    id: employer.id
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
        let employer = await Employer.findOne({
          email
        });
        if (!employer)
          return res.status(400).json({
            message: "Employer Not Exist"
          });
  
        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch)
          return res.status(400).json({
            message: "Incorrect Password !"
          });
  
        const payload = {
          employer: {
            id: employer.id
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
      // request.employer is getting fetched from Middleware after token authentication
      const employer = await Employer.findById(req.employer.id);
      res.json(employer);
    } catch (e) {
      res.send({ message: "Error in Fetching employer" });
    }
  });

module.exports = router;