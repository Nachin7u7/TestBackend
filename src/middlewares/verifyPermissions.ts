import { Request, Response, NextFunction } from 'express';
import { utils } from "../utils";

const {userPermissions} = utils;
const verifyPermissions = (action: string) => {
    return (req: Request, res: Response, next: NextFunction): Response | void => {
        const {type} = req.user as any;
        if (userPermissions[type] && userPermissions[type][action]) {
            next(); 
        } else {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }
    };
};

export default verifyPermissions;
