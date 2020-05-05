const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const auth = require("../middleware/auth");
const jobsController = require("../controllers/jobs.controller")

router.get("/getAllJobs", jobsController.getAllJobs );
router.get("/getSingleJobs", auth, jobsController.getSingleJobs );
router.post("/create", auth, jobsController.createJob );
router.put("/update", auth, jobsController.updateJob );
router.delete("/delete", auth, jobsController.deleteJob );

module.exports = router;