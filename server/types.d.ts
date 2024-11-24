import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload | { id: number }; // Adjust this based on your JWT payload structure
    }
  }
}
