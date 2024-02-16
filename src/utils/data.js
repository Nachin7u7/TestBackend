const userPermissions = {
  normal: {
    isAllowedToCreateProblem: false,
    isAllowedToCreateAdmin: false
  },
  admin: {
    isAllowedToCreateProblem: true,
    isAllowedToCreateAdmin: true
  },
};

module.exports = { userPermissions };
