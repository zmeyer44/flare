import Link from "next/link";
import { LineGraph } from "./_components/LineGraph";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventPage({
  params: { market },
}: {
  params: {
    market: string;
  };
}) {
  const data = [
    0.5, 0.5, 0.5, 0.59, 0.63, 0.71, 0.6, 0.76, 0.81, 0.98, 0.987, 0.95, 0.99,
    0.55, 0.45, 0.49, 0.4, 0.7,
  ];
  return (
    <div className="flex gap-6">
      <div className="flex max-w-[800px] flex-1 flex-col gap-y-6">
        <div className="flex gap-x-4">
          <Avatar className="!aspect-square h-[100px] w-[100px] overflow-hidden rounded-lg">
            <AvatarImage
              src="https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100"
              className="h-full w-full object-cover"
            />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="pt-2">
              <h2 className="line-clamp-1 text-xl font-semibold">
                Market Title
              </h2>
              <p className="line-clamp-3 text-base text-muted-foreground">
                Market description with some short details about what is being
                offered
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-1.5">
              <Badge variant={"secondary"}>Bitcoin</Badge>
              <Badge variant={"secondary"}>Trending</Badge>
            </div>
          </div>
        </div>
        <LineGraph
          data={data.map((num) => ({
            yes: Math.round(num * 100),
            no: Math.round((1 - num) * 100),
          }))}
          primaryKey={"yes"}
        />
        <div className="h-[100vh]"></div>
      </div>
      <div className="hidden w-[300px] shrink-0 flex-col bg-red-400 md:flex">
        <Card className="sticky top-[calc(var(--header-height)_+_12px)] w-full">
          <CardHeader className="border-b p-5">
            <CardTitle>Place a bet</CardTitle>
          </CardHeader>
          <CardContent className="p-5">content</CardContent>
        </Card>
      </div>
    </div>
  );
}
