export enum Message {
  GLOBAL_ERROR = "Error occured",
  REQUEST_ERROR = "Cannot process your request",
  USERNAME_EXISTS = "Username exists",
  USERNAME_EMPTY = "Username is empty",
  PASSWORD_EMPTY = "Password is empty",
  USERNAME_PASSWORD_INCORRECT = "Username or password is incorrect",
  UNAUTHORIZED = "Unauthorized request",
  PASSWORD_CONDITION = "Password should be 8 characters and contain at least 1 uppercase letter, 1 number, and 1 special character",
}
