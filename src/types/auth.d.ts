import { Request } from "express";

export interface AuthorizedRequest<T = any> extends Request<T> {
  user: {
    email: string;
    _id: string;
    name: string;
  };
}
