import type { ReactNode } from "react";

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";

import type { Route } from "./+types/root";

import {
  NavigationMenu,
  NavigationMenuLink,
} from "./components/navigation-menu";

export function Layout({ children }: { children: React.ReactNode }): ReactNode {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
      </head>
      <body>
        <NavigationMenu>
          <NavigationMenuLink to="/">Home</NavigationMenuLink>
          <NavigationMenuLink to="/maps">Maps</NavigationMenuLink>
          <NavigationMenuLink to="/tokens">Tokens</NavigationMenuLink>
          <NavigationMenuLink to="/miscellaneous">Misc.</NavigationMenuLink>
        </NavigationMenu>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App(): ReactNode {
  return <Outlet />;
}

export const links: Route.LinksFunction = () => [
  { href: "https://fonts.googleapis.com", rel: "preconnect" },
  {
    crossOrigin: "anonymous",
    href: "https://fonts.gstatic.com",
    rel: "preconnect",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    rel: "stylesheet",
  },
];

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactNode {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

export function meta(_: Route.MetaArgs): Route.MetaDescriptors {
  return [
    { title: "Tattr" },
    { content: "Welcome to Tattr!", name: "description" },
  ];
}
