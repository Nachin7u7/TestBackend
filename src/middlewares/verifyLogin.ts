import { Request, Response, NextFunction } from 'express';

const validateLoginInput = (req: Request, res: Response, next: NextFunction): Response | void => {
    const { username, password } = req.body;
    let errors: any = {};

    if (!username) errors.username = "Please enter your username or email.";
    if (!password) errors.password = "Please enter your password.";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
    }

    next();
};

export default validateLoginInput;
