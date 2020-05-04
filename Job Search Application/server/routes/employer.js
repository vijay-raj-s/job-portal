const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const auth = require("../middleware/auth");
const employerController = require("../controllers/employer.controller")
const uploader = require('../config/upload');

 
router.post("/signup",
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
    ], employerController.signUp);



router.post( "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ], employerController.login );

  router.get("/details", auth, employerController.getDetails);

  router.put("/updateAccount", auth, employerController.updateAccount );

  router.put('/uploadLogo', auth, uploader.parser.single("image"), employerController.uploadCompanyLogo)

  
module.exports = router;