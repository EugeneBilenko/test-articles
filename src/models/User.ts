import * as bcrypt from 'bcrypt-nodejs';

import { IRegisterData, ILoginData, IUser, UserRoles } from '@interfaces/models/User';
import mongoose from '../Database';
import { JwtService } from '../services/JwtService';

const jwtService = new JwtService();

export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  register(data: IRegisterData): Promise<IUser>;
  login(data: ILoginData): Promise<string>;
}

export const UserSchema = new mongoose.Schema<IUserDocument>({
  email: { type: String, unique: true },
  pwdHash: { type: String },
  role: { type: String, enum: [ UserRoles.Admin, UserRoles.Standard ] },
}, {
  timestamps: true,
});

UserSchema.statics.register = function (data: IRegisterData): Promise<IUser> {
  const user = new User();
  user.pwdHash = data.password;
  user.email = data.email;
  user.role = data.role;
  return user.save();
};

UserSchema.statics.login = async function ({ email, password }: ILoginData) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error();
  }
  const pwdPassed = await user.comparePassword(password);

  if (!pwdPassed) {
    throw new Error()
  }

  const jwt = await jwtService.getJwt({
    id: user.id,
    role: user.role,
  });
  return jwt
};

UserSchema.pre<IUserDocument>('save', function (_next) {
  const user = this;
  if (!user.isModified('pwdHash')) {
    return _next();
  }

  bcrypt.genSalt(10, (_err, _salt) => {
    if (_err) {
      return _next(_err);
    }

    bcrypt.hash(user.pwdHash, _salt, null, (_err, _hash) => {
      if (_err) {
        return _next(_err);
      }

      user.pwdHash = _hash;
      return _next();
    });
  });
});

UserSchema.methods.comparePassword = function (_requestPassword): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(_requestPassword, this.pwdHash, (_err, _isMatch) => {
      if (_err) {
        return reject(_err);
      }
      return resolve(_isMatch);
    });
  });
};

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;
