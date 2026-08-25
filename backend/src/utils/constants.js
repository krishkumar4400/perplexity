const MessageRoleEnum = {
  USER: "user",
  AI: "ai",
};

const AvailableMessageRoles = Object.values(MessageRoleEnum);

const UserRolesEnum = {
  USER: "user",
  ADMIN: "admin",
  DEVELOPER: "developer",
  TESTER: "tester",
};

const AvailableUserRoles = Object.values(UserRolesEnum);

export {
  MessageRoleEnum,
  AvailableMessageRoles,
  UserRolesEnum,
  AvailableUserRoles,
};
