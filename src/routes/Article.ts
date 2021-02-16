import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import { paramMissingError } from '@shared/constants';
import { IArticle } from '@interfaces/models/Article';
import { adminMW } from './middleware';
import Article from '../models/Article';

const router = Router();
const { BAD_REQUEST, CREATED } = StatusCodes;

interface IRequest extends Request {
  body: IArticle
}

router.post('/add', [ adminMW ], async (req: IRequest, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  const article = await Article.create(req.body);
  return res.status(CREATED).json({data: article}).end();
});

export default router;
