import { NextFunction, Request, Response } from "express"
import Joi from "joi"

export function createValidatorForSchema(schema: Joi.ObjectSchema<any>){

    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            await schema.validateAsync(req.body)
            next()
        }
        catch(error: any){
            if(error.isJoi){
                return res.status(400).json(error)
            }
            return res.status(500)
        }
    }
}