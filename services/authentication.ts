import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { StatusCode } from '../utils/constant';
import { User } from '../model/User';

interface CustomRequest extends Request {
  user: typeof User; 
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const rawJwtToken = req.headers['authorization'];

  if (!rawJwtToken || !rawJwtToken.startsWith('Bearer ')) {
    return res
      .status(StatusCode.unauthorized)
      .json({ error: 'Unauthorized' });
  }

  const jwtToken = rawJwtToken.split(' ')[1];
  if (!jwtToken) {
    return res
      .status(StatusCode.unauthorized)
      .json({ error: 'Unauthorized' });
  }

  jwt.verify(jwtToken, process.env.JWT_TOKEN as Secret, (err: jwt.VerifyErrors | null, user: any) => {
    if (err) {
      console.error('JWT Verification Error:', err);
      return res
        .status(StatusCode.forbidden)
        .json({ error: 'Token expired' });
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
