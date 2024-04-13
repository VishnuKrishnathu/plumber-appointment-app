import { Request } from "express";

export interface AuthorizedRequest<T = any> extends Request<T> {
  user: {
    email: string;
    _id: string;
    expiry: number;
    access_token: string;
    refresh_token: string;
  };
}
