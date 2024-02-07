const { userPermissions } = require("../utils/data");

const verifyPermissions = (action) => {
    return (req, res, next) => {
        const userType = req.session.passport.user.userType;

        if (userPermissions[userType] && userPermissions[userType][action]) {
            next(); 
        } else {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action.",
            });
        }
    };
};

module.exports = verifyPermissions;
