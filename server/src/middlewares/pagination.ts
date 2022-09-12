import { Request, Response, NextFunction } from "express";
export const pagination = (req: Request, res: Response, next: NextFunction) => {
  const pageQuery = req.query.page;

  if (!pageQuery || Number.isNaN(+pageQuery) || +pageQuery < 0) {
    res.locals.page = 0;
    return next();
  }

  res.locals.page = +pageQuery;
  next();
};
