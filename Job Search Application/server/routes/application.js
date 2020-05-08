const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const jobApplicationController = require("../controllers/jobApplication.controller")

router.post("/apply", auth, jobApplicationController.applyJob );
router.get("/getApplications/:id", jobApplicationController.getApplications );

router.put("/changeStatus", auth, jobApplicationController.changeStatus );


module.exports = router;