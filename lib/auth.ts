"use server";
import prisma from "@/lib/prisma";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { User, Session } from "@/app/generated/prisma";

import { cookies } from "next/headers";
import { cache } from "react";

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await prisma.session.create({
    data: session,
  });
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });
  if (result === null) {
    return { session: null, user: null };
  }
  const { user, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }
  //check user obj
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId: userId,
    },
  });
}

export type SessionValidationResult =
  | { session: Session; user: Omit<User, "passwordHash"> }
  | { session: null; user: null };

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value ?? null;
    if (token === null) {
      return { session: null, user: null };
    }
    const result = await validateSessionToken(token);
    return result;
  }
);

export const hashedPasword = async (password: string) => {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  const hashed = await hashedPasword(password);
  return hashed === hashedPassword;
};


export const registerUser = async (
  email: string,
  password: string,
  //firstName: string | null = null,
  //lastName: string | null = null
) => {
  const passwordHashed = await hashedPasword(password);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: passwordHashed,
      },
    });

    const retunUser = {
      ...user,
      passwordHash: undefined,
    };

    return {
      user: retunUser,
      error: null,
    };

  } catch (error) {
    return {
      user: null,
      error: "User registration error" + error,
    };
  }
};


export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });

    if(!user) {
        return {
            user: null,
            error: "User not found",
        }
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);
    if(!passwordValid) {
        return {
            user: null,
            error: "Invalid password",
        }
    }

    const token = await generateSessionToken();
    const session = await createSession(token, user.id);
    await setSessionTokenCookie(token, session.expiresAt);

    const safeUser = {
        ...user,
        passwordHash: undefined,
    };

    return {
        user: safeUser,
        error: null,
    }
}

export const logoutUser = async () => {
    const session = await getCurrentSession();
    if(session.session?.id) {
        await invalidateSession(session.session.id);
    }
    await deleteSessionTokenCookie();
}
