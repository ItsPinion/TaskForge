import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "super-secret-key";

export type TokenPayload = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export function generateToken(
  id: number,
  name: string,
  email: string,
  role: string,
) {
  return jwt.sign(
    {
      id,
      name,
      email,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
