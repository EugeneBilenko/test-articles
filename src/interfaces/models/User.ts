export enum UserRoles {
  Standard='Standard',
  Admin='Admin',
}

export interface IUser {
  email: string;
  pwdHash: string;
  role: UserRoles;
}

export interface IRegisterData {
  email: string,
  password: string,
  role: UserRoles
}
export interface ILoginData {
  email: string,
  password: string,
}
