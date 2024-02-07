const express = require("express");
const router = express.Router();
const problemCreationController = require("../controllers/problemCreationController");
const verifyPermissions = require("../middlewares/verifyPermissions");
const userAuth = require("../middlewares/userAuth");


router.get("/getMyProblems", userAuth, problemCreationController.getMyProblems);
router.post("/create", userAuth, verifyPermissions('isAllowedToCreateProblem'), problemCreationController.createProblem);
router.get("/getProblemData", userAuth, problemCreationController.getProblemData);
router.post("/save", userAuth, verifyPermissions('isAllowedToCreateProblem'), problemCreationController.saveProblem);
router.post("/saveandpublish", userAuth, verifyPermissions('isAllowedToCreateProblem'), problemCreationController.saveAndPublishProblem);


module.exports = router;
