import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction):void => {
  
  const token = req.cookies.admin_access_token;  
  // const refreshToken = req.cookies.admin_refresh_token;  
  console.log("token: ",token);
  
  if (!token) {
    console.log("ivde error adikkum");
    res.status(401).json({ success: false, message: 'Unauthorized access' });
    return;
    }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log(11,decoded);
    

    if ((decoded as any).data !== process.env.ADMIN_EMAIL) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return
    }

    next();
  } catch (error :any) {
    // res.status(401).json({ success: false, message: 'Token verification failed' });
    // return
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Token expired' });
    } else {
      res.status(401).json({ success: false, message: 'Token verification failed' });
    }
    return;
  }
};


