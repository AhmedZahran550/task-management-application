import { Request } from 'express';
import { IUser } from '../../DB/models/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
