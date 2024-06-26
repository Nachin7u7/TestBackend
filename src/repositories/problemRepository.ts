import { IProblemEntity } from "../entities/IProblemEntity";
import { ISemiProblemEntity } from "../entities/ISemiProblemEntity";

export interface ProblemRepository {
    findProblemsByPublished(isPublished: boolean): Promise<IProblemEntity[]>;
    findProblemByIdAndPublished(problemId: number, isPublished: boolean): Promise<IProblemEntity | null>;
    findPublishedProblemById(problemId: number): Promise<IProblemEntity | null>;
    findProblemsByAuthor(authorId: string): Promise<IProblemEntity[]>;
    createNewProblem(problemData: IProblemEntity): Promise<IProblemEntity>;
    findProblemByIdAndAuthor(problemId: string, authorId: string): Promise<IProblemEntity | null>;
    updateProblem(problemId: number, updateData: IProblemEntity, problemName: string): Promise<IProblemEntity | null>;
    findProblemByName(problemName: string): Promise<IProblemEntity | null>;
    incrementProblemIdCounter(): Promise<number>;
    publishProblem(problemId: string, updatedData: ISemiProblemEntity): Promise<IProblemEntity | null>;
}
