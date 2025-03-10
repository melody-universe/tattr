import type { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { expect, test } from "vitest";

test("shows the home page", () => {
  const App = createRoutesStub([
    {
      Component: (): ReactNode => <p>Welcome to Tattr.</p>,
      path: "/",
    },
  ]);

  render(<App initialEntries={["/"]} />);

  expect(screen.getByText("Welcome to Tattr.")).toBeInTheDocument();
});
