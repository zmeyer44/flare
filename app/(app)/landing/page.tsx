"use client";
import { useState } from "react";
import LandingPage from "./LandingPage";
import LoadingPage from "./loading";
// import HeroSection from "../_sections/Hero";
// import TrendingSection from "../_sections/Trending";
// import ChannelSection from "../_sections/Channels";

export default function Page() {
  const [mounted] = useState(true);
  if (!mounted) {
    return <LoadingPage />;
  }
  return <LandingPage />;
}
