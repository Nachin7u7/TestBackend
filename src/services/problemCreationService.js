const problemCreationRepository = require("../repositories/problemCreationRepository");

const getMyProblems = async (authorId) => {
    try {
        return await problemCreationRepository.findProblemsByAuthor(authorId);
    } catch (error) {
        throw new Error('Error al obtener mis problemas');
    }
};

const createProblem = async (userId, problemName, sampleProblemData) => {
    try {
        // Verificar si el problema con el mismo nombre ya existe
        const existingProblem = await problemCreationRepository.findProblemByName(problemName);
        if (existingProblem) {
            throw new Error('Un problema con el mismo nombre ya existe.');
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

        return await problemCreationRepository.createNewProblem(problemData);
    } catch (error) {
        throw error; // Propagar el error para manejo específico en el controlador
    }
};

const getProblemData = async (problemId, authorId) => {
    try {
        return await problemCreationRepository.findProblemByIdAndAuthor(problemId, authorId);
    } catch (error) {
        throw new Error('Error al obtener los datos del problema');
    }
};

const saveProblem = async (problemId, authorId, updateData) => {
    try {
        return await problemCreationRepository.updateProblem(problemId, { author: authorId, ...updateData });
    } catch (error) {
        throw new Error('Error al guardar el problema');
    }
};

const saveAndPublishProblem = async (problemId, authorId, updateData) => {
    try {
        const update = {
            ...updateData,
            isPublished: true,
        };
        return await problemCreationRepository.publishProblem(problemId, { author: authorId, ...update });
    } catch (error) {
        throw new Error('Error al guardar y publicar el problema');
    }
};

module.exports = {
    getMyProblems,
    createProblem,
    getProblemData,
    saveProblem,
    saveAndPublishProblem,
};
