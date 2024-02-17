const problemCreationService = require('../services/problemCreationService');

exports.getMyProblems = async (req, res) => {
  try {
    const authorId = req.session.passport.user._id; // Asegúrate de que esta línea refleje cómo accedes al ID del usuario en tu aplicación
    const problems = await problemCreationService.getMyProblems(authorId);
    res.json({
      success: true,
      data: problems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const userId = req.session.passport.user._id;
    const { problemName, sampleProblemData } = req.body;
    const problem = await problemCreationService.createProblem(
      userId,
      problemName,
      sampleProblemData
    );
    res.status(200).json({
      success: true,
      message: 'Problem created successfully',
      data: problem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProblemData = async (req, res) => {
  try {
    const authorId = req.session.passport.user._id;
    const { _id } = req.query;
    const problem = await problemCreationService.getProblemData(_id, authorId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }
    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.saveProblem = async (req, res) => {
  try {
    const authorId = req.session.passport.user._id;
    const { _id, problem } = req.body;
    await problemCreationService.saveProblem(_id, authorId, problem);
    res.status(200).json({
      success: true,
      message: 'Problem saved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.saveAndPublishProblem = async (req, res) => {
  try {
    const authorId = req.session.passport.user._id;
    const { _id, problem } = req.body; // Asume que estos datos están presentes en la solicitud
    await problemCreationService.saveAndPublishProblem(_id, authorId, problem);
    res.status(200).json({
      success: true,
      message: 'Problem saved and published successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
