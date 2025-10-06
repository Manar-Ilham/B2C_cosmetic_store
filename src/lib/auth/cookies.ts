import { NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

export function setAuthCookies(res: NextResponse, access: string, refresh: string) {
  res.cookies.set("access_token", access, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day (browser will still respect JWT exp)
  });
  res.cookies.set("refresh_token", refresh, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("access_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("refresh_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
