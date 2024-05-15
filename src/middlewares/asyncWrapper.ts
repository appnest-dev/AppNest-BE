import { Request, Response, NextFunction } from "express";

const asyncWrapper = (
  asyncFn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    asyncFn(req, res, next).catch(next);
  };
};

export default asyncWrapper;
