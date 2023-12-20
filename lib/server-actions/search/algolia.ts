"use server";
import algoliasearch from "algoliasearch";
import { Video } from "@prisma/client";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_ADMIN_API_KEY as string,
);

const index = client.initIndex("Videos");

export const updateVideo = async ({
  d,
  kind,
  pubkey,
  summary,
  title,
  thumbnail,
  published_at,
  viewCount,
}: Video) => {
  try {
    await index.partialUpdateObject(
      {
        title,
        summary,
        viewCount,
        published_at,
        thumbnail,
        kind,
        pubkey,
        tagId: `${kind}:${pubkey}:${d}`,
        objectID: `${kind}:${pubkey}:${d}`,
      },
      {
        createIfNotExists: true,
      },
    );
  } catch (err) {
    console.log("Algolia error", err);
  }
};

export const deleteVideo = async ({
  id,
}: {
  id: `${string}:${string}:${string}`;
}) => {
  try {
    await index.deleteObject(id);
  } catch (err) {
    console.log("Algolia error", err);
  }
};
