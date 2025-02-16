import type { ReactNode } from "react";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";

export default function Maps(): ReactNode {
  return (
    <PageLayout>
      <Card>
        Upload and tweak your maps and print them out into tiled PDF&apos;s that
        you can tape together.
      </Card>
    </PageLayout>
  );
}
