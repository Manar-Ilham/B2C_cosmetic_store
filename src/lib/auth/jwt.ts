import jwt from "jsonwebtoken";

const ACCESS_SECRET  = process.env.ACCESS_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;
const ACCESS_EXP   = process.env.ACCESS_TOKEN_EXPIRES ?? "15m";
const REFRESH_EXP  = process.env.REFRESH_TOKEN_EXPIRES ?? "7d";

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets missing in env");
}

type JwtPayload = { sub: string; role?: string; type: "access" | "refresh" };

export function signAccessToken(userId: string, role?: string) {
  const payload: JwtPayload = { sub: userId, role, type: "access" };
  const secret: jwt.Secret = ACCESS_SECRET;
  const expires: jwt.SignOptions["expiresIn"] = ACCESS_EXP as unknown as jwt.SignOptions["expiresIn"];
  const opts: jwt.SignOptions = { expiresIn: expires };
  return jwt.sign(payload as jwt.JwtPayload, secret, opts);
}

export function signRefreshToken(userId: string, role?: string) {
  const payload: JwtPayload = { sub: userId, role, type: "refresh" };
  const secret: jwt.Secret = REFRESH_SECRET;
  const expires: jwt.SignOptions["expiresIn"] = REFRESH_EXP as unknown as jwt.SignOptions["expiresIn"];
  const opts: jwt.SignOptions = { expiresIn: expires };
  return jwt.sign(payload as jwt.JwtPayload, secret, opts);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET as jwt.Secret) as JwtPayload & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET as jwt.Secret) as JwtPayload & jwt.JwtPayload;
}