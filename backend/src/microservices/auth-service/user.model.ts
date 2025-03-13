import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { IUser, Role } from './types';

interface IUserDocument extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: Role[];
  isActive: boolean;
  isBlocked: boolean;
  matchPassword(enteredPassword: string,password:string): Promise<boolean>;
}

const userSchema: Schema<IUserDocument> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      // select: false, // Exclude password from query results by default
    },
    role: {
      type: [String],
      required: [true, 'Role is required'],
      default: [Role.DISPATCHER],
      validate: {
        validator: function (value: string[]) {
          if (!Array.isArray(value)) {
            throw new Error('Role must be an array');
          }
          const allowedRoles = Object.values(Role);
          const invalidRoles = value.filter((role) => !allowedRoles.includes(role as Role));
          if (invalidRoles.length > 0) {
            throw new Error(`Invalid role(s) provided: ${invalidRoles.join(', ')}`);
          }
          return true;
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


// Password hashing middleware
userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = parseInt(process.env.SALT_ROUNDS as string)
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword: string,password:string): Promise<boolean> {
  console.log("enteredPassword", enteredPassword)
  console.log("this.password", password)
  if (!enteredPassword || !password) {
    throw new Error('Password and hash are required for comparison');
  }
  return bcrypt.compare(enteredPassword, password);
};
  

const User = mongoose.model<IUserDocument>('User', userSchema);

export default User;