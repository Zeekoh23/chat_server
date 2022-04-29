import mongoose, {
  HookNextFunction,
  Schema,
  model,
  Document,
  Model,
} from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IUser {
  name: string;
  email: string;
  number: string;
  image: string;
  about: string;
  password: string;
  passwordConfirm: any;
  passwordChangedAt: any;
  passwordResetToken: string;
  passwordResetExpires: any;
}

export interface IUserDoc extends IUser, Document {
  createPasswordResetToken(): string;
  changePasswordAfter(JWTTimestamps: any): Promise<boolean>;
  correctPassword(candidatePassword: any, userPassword: any): any;
}

const userSchemaFields: Record<keyof IUser, unknown> = {
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide an email"],
  },
  number: {
    type: String,
    required: [true, "Please provide your number"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  image: {
    type: String,
  },
  about: {
    type: String,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (this: IUser, el: any) {
        return el === this.password;
      },
      message: "Password are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
};

const userSchema = new Schema<IUser>(userSchemaFields);

userSchema.pre("save", async function (next: HookNextFunction) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 14);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next: HookNextFunction) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (this: any, next: HookNextFunction) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function correctPassword(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = async function (
  JWTTimestamps
): Promise<boolean> {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamps);
    return JWTTimestamps < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User: Model<IUserDoc> = model<IUserDoc>("User", userSchema);

export { User };
