const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require('../utils/catchAsync');
const { validationResult} = require("express-validator");
const Employer = require("../model/Employer");
const multer = require('multer');


const signUp = catchAsync(async (req, res) => {
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

const login = catchAsync(async (req, res) => {
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
            "token" : token,
            "id": employer.id
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
      // request.employer is getting fetched from Middleware after token authentication
      const employerFromDb = await Employer.findById(req.employer.id, '-password');
      res.json(employerFromDb);
    } catch (e) {
      res.send({ message: "Error in Fetching employer" });
    }
  });

  const updateAccount = catchAsync(async (req, res) => {
    const employer = req.body;
    try {
      let currentEmployer = await Employer.findById(req.employer.id);
      if (!currentEmployer)
        return res.status(400).json({
          message: "Employer Not Exist"
        });  
      currentEmployer.employerName = employer.employerName;
      currentEmployer.email = employer.email;
      currentEmployer.companyName = employer.companyName;
      currentEmployer.contact = employer.contact; 
      currentEmployer.location = employer.location;
      currentEmployer.companyUrl = employer.companyUrl;
      await currentEmployer.save();
      res.status(200).json({message: "updated Successfully"});
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  });

  const uploadCompanyLogo = catchAsync(async (req, res) => {
    const id = req.employer.id; 
    try {
      let currentEmployer = await Employer.findById(id);
      if (!currentEmployer)
        return res.status(400).json({
          message: "Employer Not Exist"
        });  
      currentEmployer.companyLogo = req.file.url;
      await currentEmployer.save();
      res.status(200).json({
        url: req.file.url
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }); 
 

module.exports = {
    signUp,
    login,
    getDetails,
    updateAccount,
    uploadCompanyLogo
}