const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const auth = require("../middleware/auth");
const jobsController = require("../controllers/jobs.controller")

router.get("/getAllJobs", jobsController.getAllJobs );
router.get("/getSingleJobs", auth, jobsController.getSingleJobs );
router.post("/create", auth, jobsController.createJob );
router.put("/update/:id", auth, jobsController.updateJob );
router.delete("/delete/:id", auth, jobsController.deleteJob );
router.get("/getSingleEmployerJobs/:id",jobsController.getSingleEmployerJobs)

router.post("/saveJob", auth, jobsController.saveJob);

router.get("/getSavedJobs", auth , jobsController.getSavedJobs);

module.exports = router;