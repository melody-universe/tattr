import type { ReactNode } from "react";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";

export default function Tokens(): ReactNode {
  return (
    <PageLayout>
      <Card>
        Upload assets to create tokens that you can print out and crop up.
      </Card>
    </PageLayout>
  );
}
