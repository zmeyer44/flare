"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Split from "@/components/spread/Split";
import { Button } from "@/components/ui/button";

export default function MarketCard() {
  return (
    <Card className="group overflow-hidden">
      <CardHeader className="space-y-4 p-5">
        <div className="flex items-start justify-between">
          <Avatar className="!aspect-square h-[50px] w-[50px] overflow-hidden rounded-lg">
            <AvatarImage
              src="https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100"
              className="h-full w-full object-cover"
            />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap gap-2">
            <Badge variant={"secondary"}>Politics</Badge>
            <Badge variant={"default"}>2.4k sats</Badge>
          </div>
        </div>
        <div className="space-y-2">
          <CardTitle className="line-clamp-2">Test Title</CardTitle>
          <CardDescription className="line-clamp-3">
            Here is a short description about what you are about to bet on.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="relative transform bg-background p-5 pt-0 transition-all group-hover:translate-y-[-50px]">
        <div className="flex flex-col gap-y-0.5">
          <span className="text-center text-[10px] leading-3 text-muted-foreground">
            Win Probability
          </span>
          <Split shares={[0.4, 0.6]} />
        </div>
        <div className="absolute inset-x-0 -bottom-full w-full bg-background pt-5">
          <div className="flex items-center gap-2 px-5 transition-all group-hover:translate-y-[-20px]">
            <Button className="flex-1 rounded-sm font-semibold" size={"sm"}>
              Buy Yes
            </Button>
            <Button
              className="flex-1 rounded-sm font-semibold"
              size={"sm"}
              variant={"secondary"}
            >
              Buy No
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 -top-full hidden h-[50px] bg-gradient-to-t from-background via-background/80 group-hover:block" />
      </CardContent>
    </Card>
  );
}
