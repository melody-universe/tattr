import type { ReactNode } from "react";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";

export function HomePage(): ReactNode {
  return (
    <PageLayout>
      <Card>
        Welcome to Tattr. This is a tool for managing crafts for tabletop
        role-playing games.
      </Card>
    </PageLayout>
  );
}
