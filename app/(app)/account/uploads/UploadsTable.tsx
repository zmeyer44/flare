"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn, formatCount } from "@/lib/utils";
import useEvents from "@/lib/hooks/useEvents";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import { NDKKind } from "@nostr-dev-kit/ndk";
import { getTagValues } from "@/lib/nostr/utils";

export default function UploadsTable() {
  const { currentUser } = useCurrentUser();
  const { events, isLoading } = useEvents({
    filter: {
      kinds: [34235 as NDKKind, 34236 as NDKKind],
      authors: [currentUser?.pubkey ?? ""],
    },
  });

  const filteredUploads = events
    .filter((e) => {
      const fileType = getTagValues("m", e.tags);
      if (fileType?.startsWith("video")) return true;
    })
    .map((e) => {
      return {
        id: e.id,
        thumb: getTagValues("thumb", e.tags) ?? getTagValues("image", e.tags),
        title: getTagValues("title", e.tags) ?? getTagValues("name", e.tags),
        summary: getTagValues("summary", e.tags) ?? e.content,
        status: "Published",
        totalAmount: 0,
        viewCount: 0,
      };
    });
  return (
    <Table className="w-full">
      <TableCaption>A list of your recent uploads.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[350px]">Video</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Metrics</TableHead>
          <TableHead className="text-right">
            Sats Earned (comming soon)
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUploads.map((upload) => (
          <TableRow key={upload.id}>
            <TableCell className="flex gap-x-2 overflow-hidden">
              <div className="relative h-full w-[90px] shrink-0 overflow-hidden rounded-md">
                <AspectRatio ratio={21 / 14} className="bg-muted">
                  {!!upload.thumb && (
                    <Image
                      src={upload.thumb}
                      alt={upload.title ?? ""}
                      width={150}
                      height={70}
                      unoptimized
                      className={cn(
                        "h-full w-full object-cover",
                        "aspect-[21/14]",
                      )}
                    />
                  )}
                </AspectRatio>
              </div>
              <div className="min-w-[150px]">
                <h3 className="line-clamp-1 text-base font-medium">
                  {upload.title ?? ""}
                </h3>
                <p className="line-clamp-2 text-xs font-normal text-muted-foreground">
                  {upload.summary ?? ""}
                </p>
              </div>
            </TableCell>
            <TableCell>{upload.status}</TableCell>
            <TableCell>{`${formatCount(upload.viewCount)} views`}</TableCell>
            <TableCell className="text-right">{upload.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total Earnings</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
  );
}
