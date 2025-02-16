import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import { NavigationMenu as RadixNavigationMenu } from "radix-ui";
import { NavLink } from "react-router";

export function NavigationMenu({ children }: NavigationMenuProps): ReactNode {
  return (
    <RadixNavigationMenu.Root className="flex w-screen justify-center">
      <RadixNavigationMenu.List className="flex justify-center">
        {children}
      </RadixNavigationMenu.List>
    </RadixNavigationMenu.Root>
  );
}

export function NavigationMenuLink({
  children,
  to,
}: NavigationMenuLinkProps): ReactNode {
  return (
    <RadixNavigationMenu.Item>
      <NavLink
        className={({ isActive }) =>
          `mx-1 rounded-b-full px-3 pt-1 pb-3 ${
            isActive
              ? `bg-violet-950 font-semibold dark:bg-violet-50 dark:text-black`
              : `bg-violet-50 dark:bg-violet-900`
          }`
        }
        to={to}
      >
        {children}
      </NavLink>
    </RadixNavigationMenu.Item>
  );
}

type NavigationMenuLinkProps = PropsWithChildren<{ to: string }>;

type NavigationMenuProps = {
  children: NavigationMenuItem | NavigationMenuItem[];
};

type NavigationMenuItem = ReactElement<
  NavigationMenuLinkProps,
  typeof NavigationMenuLink
>;
