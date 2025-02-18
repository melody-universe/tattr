import type { ReactNode } from "react";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";

export default function Miscellaneous(): ReactNode {
  return (
    <PageLayout>
      <Card>
        Here are some tools that don&apos;t fit into any other categories just
        yet. I&apos;m sure I&apos;ll find a better place for them in the future.
      </Card>
    </PageLayout>
  );
}
