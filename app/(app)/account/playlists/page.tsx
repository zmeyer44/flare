"use client";
import { Separator } from "@/components/ui/separator";
import PlaylistsGrid from "./PlaylistsGrid";
import NewPlaylistButton from "./components/NewPlaylistButton";

export default function VideosPage() {
  return (
    <div className="space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">My Playlists</h3>
          <p className="text-sm text-muted-foreground">
            Here are all of the playlists you have created
          </p>
        </div>
        <div className="">
          <NewPlaylistButton />
        </div>
      </div>
      <Separator />
      <PlaylistsGrid />
    </div>
  );
}
