// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.admin_access_token;  

//   if (!token) {
//     return res.status(401).json({ success: false, message: 'Unauthorized access' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     if ((decoded as any).email !== process.env.ADMIN_EMAIL) {
//       return res.status(401).json({ success: false, message: 'Invalid token' });
//     }
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: 'Token verification failed' });
//   }
// };


