import BannerImage from "./components/BannerImage";
import ProfileInfo from "./components/ProfileInfo";
import VerticalVideosFeed from "@/containers/feeds/VerticalVideosFeed";
import VideosGrid from "@/containers/feeds/VideosGrid";
import type { NDKKind } from "@nostr-dev-kit/ndk";

type ChannelPageProps = {
  user: string;
};
export default function ChannelPage({
  params: { user },
}: {
  params: ChannelPageProps;
}) {
  const npub = user;
  const profile = {
    name: "Zach",
    displayName: "Zach Meyer",
    image:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100",
    nip05: "zach@flockstr.com",
  };
  return (
    <div className="space-y-3">
      <div className="">
        <BannerImage
          url={
            "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100"
          }
        />
      </div>
      <div className="lg:pt-1">
        <ProfileInfo profile={profile} npub={npub} />
      </div>
      <div className="pt-1 md:pt-3">
        <div className="md:hidden">
          <VerticalVideosFeed
            title="Videos"
            filter={{
              authors: [npub],
              kinds: [34235 as NDKKind],
            }}
          />
        </div>
        <div className="hidden md:block">
          <VideosGrid
            title="Videos"
            filter={{
              authors: [npub],
              kinds: [34235 as NDKKind],
            }}
          />
        </div>
      </div>
    </div>
  );
}
