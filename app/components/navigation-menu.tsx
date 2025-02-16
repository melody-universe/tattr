import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import { NavigationMenu as RadixNavigationMenu } from "radix-ui";
import { Link, useLocation } from "react-router";

export function NavigationMenu({ children }: NavigationMenuProps) {
  return (
    <RadixNavigationMenu.Root className="flex w-screen justify-center">
      <RadixNavigationMenu.List className="flex justify-center">
        {Array.isArray(children)
          ? children.map((child) => (
              <RadixNavigationMenu.Item>{child}</RadixNavigationMenu.Item>
            ))
          : children}
      </RadixNavigationMenu.List>
    </RadixNavigationMenu.Root>
  );
}

export function NavigationMenuLink({
  children,
  to,
}: NavigationMenuLinkProps): ReactNode {
  const location = useLocation();
  const isActive = to === location.pathname;

  return (
    <RadixNavigationMenu.Item
      className={`mx-1 rounded-b-full px-3 pt-1 pb-3 ${
        isActive
          ? `bg-violet-950 font-semibold dark:bg-violet-50 dark:text-black`
          : `bg-violet-50 dark:bg-violet-900`
      }`}
    >
      <Link to={to}>
        <RadixNavigationMenu.Link>{children}</RadixNavigationMenu.Link>
      </Link>
    </RadixNavigationMenu.Item>
  );
}

type NavigationMenuLinkProps = PropsWithChildren<{ to: string }>;

interface NavigationMenuProps {
  children: NavigationMenuItem | NavigationMenuItem[];
}

type NavigationMenuItem = ReactElement<NavigationMenuLinkProps>;
