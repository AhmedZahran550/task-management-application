import jwt from "jsonwebtoken";
import { User, IUser } from "../../../DB/models/user.model.js";
import { AppError } from "../../utils/appError.js";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResult {
  user: IUser;
  token: string;
}

export class AuthService {
  private static generateToken(userId: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new AppError("JWT secret configuration is missing", 500);
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
      "7d") as jwt.SignOptions["expiresIn"];
    return jwt.sign({ _id: userId }, jwtSecret, { expiresIn });
  }

  static async register(data: RegisterDTO): Promise<AuthResult> {
    let user;
    try {
      user = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError("Email address is already in use", 409);
      }
      throw error;
    }

    const token = this.generateToken(user._id.toString());
    return { user, token };
  }

  static async login(data: LoginDTO): Promise<AuthResult> {
    const user = await User.findOne({ email: data.email.toLowerCase() }).select(
      "+password",
    );
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // Clear password from the document before returning
    user.password = undefined;

    const token = this.generateToken(user._id.toString());
    return { user, token };
  }
}
