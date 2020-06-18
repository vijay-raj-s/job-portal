const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const jobApplicationController = require("../controllers/jobApplication.controller")

router.post("/apply", auth, jobApplicationController.applyJob );
router.get("/getApplications", auth, jobApplicationController.getApplications );
router.post("/createNodesForJobRecommendation", auth, jobApplicationController.createNodesForRecommendation );
router.get("/getAllApplications", auth, jobApplicationController.getAllJobApplications);
router.post('/createBestFitGraph', auth, jobApplicationController.createBestFitGraph);
router.delete('/deleteAllNodes', jobApplicationController.deleteAllNodes);

router.get('/getBestFit', auth, jobApplicationController.getBestFit);

module.exports = router;