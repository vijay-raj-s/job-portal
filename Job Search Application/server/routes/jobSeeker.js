const express = require("express");
const { check} = require("express-validator");
const router = express.Router();
const auth = require("../middleware/auth");
const jobseekerController = require("../controllers/jobseeker.controller")
 
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
    ], jobseekerController.signUp);



router.post(
    "/login",
    [
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6
      })
    ], jobseekerController.login);

  router.get("/details", auth, jobseekerController.getDetails);

  router.put("/updateAccount", auth, jobseekerController.updateAccount)

module.exports = router;
