"use server";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

/**
 * Register user — called from /api/auth/register
 */
export async function registerUser(email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed }
  });

  return user;
}

/**
 * Sets auth cookie — used after login or registration
 */
export async function setAuthCookie(userId: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "auth",
    value: userId,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/"
  });
}

/**
 * Validate session — used in protected pages
 */
export async function requireUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth")?.value;

  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session }
  });
}
