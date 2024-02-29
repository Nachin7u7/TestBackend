const { HTTP_STATUS } = require('../constants');
const verifyAdminIdMatch = async (req, res, next) => {
    const { id } = req.user;
    const { adminId } = req.query;
    if(!adminId){
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Make sure to pass the query parameter adminId',
        });
    }
    if(adminId !== id){
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'Request rejected, credentials do not match',
        });
      }
    next();
}

module.exports = verifyAdminIdMatch;