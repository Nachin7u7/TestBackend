const router = require("express").Router();
const { config } = require("dotenv");
const userAuth = require("../middlewares/userAuth");
const problemControllers = require("../controllers/problemController");
const submissionControllers = require("../controllers/submissionController");
const userControllers = require("../controllers/userController");

router.get("/getProblemsList", problemControllers.getProblemsList);

router.get("/getProblemData", problemControllers.getProblemData);

router.post("/compileAndRun", userAuth, submissionControllers.compileAndRun);

router.get(
  "/submissionsList",
  userAuth, // Comentar para hacer pruebas
  submissionControllers.userSubmissionsList
);

router.get(
  "/leaderboard",
  submissionControllers.leaderboardProblemSubmissionsList
);

router.get("/globalLeaderboard", userControllers.globalLeaderboard);

module.exports = router;
