import type { ReactNode } from "react";

// import * as schema from "~/database/schema";
import type { Route } from "./+types/home";

import { HomePage } from "../home-page/home-page";

export default function Home(): ReactNode {
  // {
  //   actionData,
  //   loaderData,
  // }: Route.ComponentProps
  return <HomePage />;
}

export async function action({
  // context,
  request,
}: Route.ActionArgs) {
  const formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  if (typeof name !== "string" || typeof email !== "string") {
    return { guestBookError: "Name and email are required" };
  }

  name = name.trim();
  email = email.trim();
  if (!name || !email) {
    return { guestBookError: "Name and email are required" };
  }

  try {
    // await context.db.insert(schema.guestBook).values({ email, name });
  } catch {
    return { guestBookError: "Error adding to guest book" };
  }
}

export function loader({ context }: Route.LoaderArgs) {
  // const guestBook = await context.db.query.guestBook.findMany({
  //   columns: {
  //     id: true,
  //     name: true,
  //   },
  // });

  return {
    // guestBook,
    message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE,
  };
}

export function meta(_: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: "New React Router App" },
    { content: "Welcome to React Router!", name: "description" },
  ];
}
