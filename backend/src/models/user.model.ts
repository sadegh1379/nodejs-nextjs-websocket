import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// اینترفیس برای تایپ دادن به مدل
interface IUser extends Document {
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

// اسکیما و مدل کاربر
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// هش کردن پسورد قبل از ذخیره در دیتابیس
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// متد مقایسه پسورد
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
