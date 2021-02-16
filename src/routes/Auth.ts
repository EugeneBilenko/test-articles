import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';

import { JwtService } from '../services/JwtService';
import { paramMissingError, loginFailedErr, cookieProps } from '@shared/constants';
import User from '../models/User';
import { ILoginData, IRegisterData } from '@interfaces/models/User';

const router = Router();
const { BAD_REQUEST, OK, UNAUTHORIZED, CREATED } = StatusCodes;

interface IRegisterRequest extends Request {
  body: IRegisterData
}

interface ILoginRequest extends Request {
  body: ILoginData
}

router.post('/register', async (req: IRegisterRequest, res: Response) => {
  const { email, password, role } = req.body;
  if (!(email && password)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await User.register({ email, password, role });
  res.status(CREATED).end();
});
router.post('/login', async (req: ILoginRequest, res: Response) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  try {
    const jwt = await User.login(req.body);
    const { key, options } = cookieProps;
    res.cookie(key, jwt, options);
    return res.status(OK).end();
  } catch (e) {
    return res.status(UNAUTHORIZED).json({
      error: loginFailedErr,
    });
  }

});

export default router;
