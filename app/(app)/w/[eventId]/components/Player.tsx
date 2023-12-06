"use client";
import VideoPlayer from "@/components/videoPlayer";
export default function Player() {
  return (
    <div className="">
      <VideoPlayer
        src="https://stream.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/low.mp4"
        title="test"
      />
    </div>
  );
}
