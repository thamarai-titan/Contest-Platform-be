import type { Request, Response, NextFunction } from "express";
import { responses } from "../utils/responses";
import jwt, { decode } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: string;
    }
  }
}
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer")) {
    return res.status(401).json(responses.error("UNAUTHORIZED"));
  }

  const token = authToken.split(" ")[1] as string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json(responses.error("UNAUTHORIZED"))
  }
};


export const requireCreator = (req:Request, res:Response, next:NextFunction) => {
    if(req.role !== "creator"){
        return res.status(403).json(responses.error("FORBIDDEN"))
    }
    next()
}


export const requireConteste = (req:Request, res:Response, next:NextFunction) => {
    if(req.role !== "contestee"){ 
        return res.status(403).json(responses.error("FORBIDDEN"))
    }
    next()
}