// // middleware/authMiddleware.ts
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export interface AuthRequest extends Request {
//   user?: any;
// }
// export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       res.status(401).json({ message: 'Authentication required' });
//       return; // Ensure function exits after sending response
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
//     req.user = decoded;
//     next(); // Ensure `next()` is always called
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid token' });
//     return; // Ensure function exits after sending response
//   }
// };

// middleware/authMiddleware.ts
// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};