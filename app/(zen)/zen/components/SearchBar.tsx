"use client";

import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="">
      <div className="max-w-[350px] rounded-full bg-muted/80 backdrop-blur">
        <Input
          className="rounded-full placeholder:text-muted-foreground"
          placeholder="Search"
        />
      </div>
    </div>
  );
}
