import type { AppLoadContext } from "react-router";

import type { Failable } from "./types/Failable";

import { assets as dbAssets } from "../../database/schema";

// This function is intended to serve as a closure around the AppLoadContext.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function assets({
  cloudflare: {
    env: { FILES: files },
  },
  db,
}: AppLoadContext) {
  async function createAsset({
    contents,
    name,
    userId,
  }: CreateAssetRequest): Promise<CreateAssetResponse> {
    const hash = await getContentHash(contents);
    try {
      await files.put(hash, contents);

      const response = await db
        .insert(dbAssets)
        .values({ hash, name, userId })
        .returning({ insertedId: dbAssets.id });

      return { assetId: response[0].insertedId, isSuccess: true };
    } catch (error) {
      return { error, isSuccess: false };
    }
  }

  type CreateAssetRequest = {
    contents: ArrayBuffer;
    name: string;
    userId: number;
  };

  type CreateAssetResponse = Failable<{ assetId: number }>;

  return { createAsset };
}

async function getContentHash(contents: ArrayBuffer): Promise<string> {
  const arrayBuffer = await crypto.subtle.digest("SHA-256", contents);
  const bytes = new Uint8Array(arrayBuffer);
  const binary = bytes.reduce(
    (hash, byte) => hash + String.fromCharCode(byte),
    "",
  );
  return btoa(binary);
}
