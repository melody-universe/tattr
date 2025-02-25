import type { ReactNode } from "react";

import { parseFormData } from "@mjackson/form-data-parser";

import { Card } from "~/components/card";
import { PageLayout } from "~/components/page-layout";
import { AssetManager } from "~/modules/asset-manager";
import { PrinterTester } from "~/modules/printer-tester";
import { assets } from "~/utils/assets.server";
import { getSession } from "~/utils/sessions.server";

import type { Route } from "./+types/miscellaneous";

export default function Miscellaneous({
  loaderData,
}: Route.ComponentProps): ReactNode {
  return (
    <PageLayout>
      <Card>
        Here are some tools that don&apos;t fit into any other categories just
        yet. I&apos;m sure I&apos;ll find a better place for them in the future.
      </Card>
      <PrinterTester />
      {loaderData.userId && <AssetManager />}
    </PageLayout>
  );
}

export async function action({ context, request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  if (!userId) {
    return { error: "You are not logged in.", isSuccess: false };
  }

  const formData = await parseFormData(request);

  const name = formData.get("name")?.valueOf();
  if (typeof name !== "string" || name.trim().length === 0) {
    return { error: "Expected name", isSuccess: false };
  }

  const contents = formData.get("contents");
  if (!(contents instanceof File) || contents.size === 0) {
    return { error: "Expected contents", isSuccess: false };
  }

  const response = await assets(context).createAsset({
    contents: await contents.arrayBuffer(),
    name,
    userId,
  });

  if (!response.isSuccess) {
    return response;
  }

  return { assetId: response, isSuccess: true };
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return { userId: session.get("userId") };
}
