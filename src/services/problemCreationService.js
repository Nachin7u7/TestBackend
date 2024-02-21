const problemCreationRepository = require("../repositories/problemCreationRepository");
const { buildLogger } = require('../plugin');

const logger = buildLogger('problemCreationService');

const getMyProblems = async (authorId) => {
    logger.log('Attempting to fetch problems for given author id.', {
        authorId: authorId
    });
    try {
        const problems = await problemCreationRepository.findProblemsByAuthor(authorId);
        logger.log('Successfully fetched problems for given author id')
        return problems;
    } catch (error) {
        logger.error('Error while fetching problems for given author id', {
            error: error.message,
            authorId: authorId
        });
        throw new Error('Error while fetching my problems');
    }
};

const createProblem = async (userId, problemName, sampleProblemData) => {
    logger.log('Attempting to create a new problem.');
    try {
        // Verificar si el problema con el mismo nombre ya existe
        const existingProblem = await problemCreationRepository.findProblemByName(problemName);
        if (existingProblem) {
            logger.error('Creation attempt failed: A problem with the same name already exists.', {
                problemName: problemName
            });
            throw new Error('A problem with the same name already exists.');        
        }

        // Incrementar el contador de ID de problema
        const problemId = await problemCreationRepository.incrementProblemIdCounter();

        // Crear el problema
        const problemData = {
            author: userId,
            problemId: problemId,
            problemName: problemName,
            saved: sampleProblemData,
            published: sampleProblemData,
            isPublished: false,
        };

        logger.log('Successfully created a new problem.', {
            problemId: problemId,
        });

        return await problemCreationRepository.createNewProblem(problemData);
    } catch (error) {
        logger.error('Error while creating a new problem.', {
            error: error.message,
            problemName: problemName,
            authorId: userId
        });
        throw error; // Propagar el error para manejo específico en el controlador
    }
};

const getProblemData = async (problemId, authorId) => {
    logger.log('Attempting to fetch problem data for given problem id and author id.', {
        problemId: problemId,
        authorId: authorId
    });
    try {
        const problemData = await problemCreationRepository.findProblemByIdAndAuthor(problemId, authorId);
        logger.log('Successfully fetched problem data for given problem id and author id.');
        return problemData;
    } catch (error) {
        logger.error('Error while fetching problem data for given ids.', {
            error: error.message,
            problemId: problemId,
            authorId: authorId
        });
        throw new Error('Error while fetching problem data');
    }
};

const saveProblem = async (problemId, authorId, updateData) => {
    logger.log('Attempting to update problem data for given problem id, author id and updateData.', {
        problemId: problemId,
        authorId: authorId,
    });
    try {
        const savedProblem = await problemCreationRepository.updateProblem(problemId, { author: authorId, ...updateData });
        logger.log('Successfully updating problem data for given problem id, author id and updateData.');        
        return savedProblem;
    } catch (error) {
        logger.error('Error while updating problem data for given problem id, author id and updateData.', {
            error: error.message,
            problemId: problemId,
            authorId: authorId,
            updateData: updateData
        });
        throw new Error('Error while updating problem data.');
    }
};


const saveAndPublishProblem = async (problemId, authorId, updateData) => {
    logger.log('Attempting to save and publish problem data for given problem id, author id and updateData.', {
        problemId: problemId,
        authorId: authorId,
    })
    try {
        const update = {
            ...updateData,
            isPublished: true,
        };
        const publishedProblem = await problemCreationRepository.publishProblem(problemId, { author: authorId, ...update });
        logger.log('Successfully saved and published problem data for given problem id, author id and updateData.');        
        return publishedProblem;
    } catch (error) {
        logger.error('Error while saving and publishing problem data for given problem id, author id and updateData.', {
            error: error.message,
            problemId: problemId,
            authorId: authorId,
            updateData: updateData
        });
        throw new Error('Error while saving and publishing problem data.');
    }
};


module.exports = {
    getMyProblems,
    createProblem,
    getProblemData,
    saveProblem,
    saveAndPublishProblem,
};
