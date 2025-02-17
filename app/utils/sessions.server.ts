import {
  createCookieSessionStorage,
  type Session as ReactRouterSession,
} from "react-router";

export { commitSession, destroySession, getSession };

export type Session = ReactRouterSession<SessionData, SessionFlashData>;

const { commitSession, destroySession, getSession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      domain: import.meta.env.DEV ? "localhost" : "tattr.melody-universe.com",
      httpOnly: true,
      maxAge: 60,
      name: "__session",
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

type SessionData = { userId: number };

type SessionFlashData = { error: string };
