interface UserPermissions {
  [userType: string]: {
      [action: string]: boolean;
  };
}

export const userPermissions : UserPermissions = {
  normal: {
    isAllowedToCreateProblem: false,
    isAllowedToCreateAdmin: false
  },
  admin: {
    isAllowedToCreateProblem: true,
    isAllowedToCreateAdmin: true
  },
};