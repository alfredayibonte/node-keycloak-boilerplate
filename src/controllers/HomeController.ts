import { Request, Response } from 'express';

const HomeControllers = {
   index(req: Request, res: Response) {
     res.status(200).json({ message: 'Health check!' });
  }
};

export default HomeControllers;