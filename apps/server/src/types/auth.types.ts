import { JWTPayload } from "jose";

export type Auth = {
  userId: string;
  token: string;
  claims: JWTPayload;
};

export type AuthEnv = {
  Variables: {
    auth: Auth;
  };
};
