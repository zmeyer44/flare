"use client";
import { Separator } from "@/components/ui/separator";
import UploadsTable from "./UploadsTable";
import UploadButton from "./components/UploadButton";
// import { SDrawer } from "@/app/_providers/alt-modal";
import { modal } from "@/app/_providers/modal";
import { Button } from "@/components/ui/button";

export default function VideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Uploads</h3>
          <p className="text-sm text-muted-foreground">
            Here are all of your videos uploaded.
          </p>
        </div>
        <div className="">
          <UploadButton />
        </div>
      </div>
      <Separator />
      <UploadsTable />
    </div>
  );
}
