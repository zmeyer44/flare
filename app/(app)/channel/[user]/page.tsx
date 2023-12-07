import BannerImage from "./components/BannerImage";
import ProfileInfo from "./components/ProfileInfo";
import VerticalVideosFeed from "@/containers/feeds/VerticalVideosFeed";

type ChannelPageProps = {
  user: string;
};
export default function ChannelPage({
  params: { user },
}: {
  params: ChannelPageProps;
}) {
  const npub = "";
  const profile = {
    name: "Zach",
    displayName: "Zach Meyer",
    image:
      "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100",
    nip05: "zach@flockstr.com",
  };
  return (
    <div className="space-y-2">
      <div className="">
        <BannerImage
          url={
            "https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fwill-the-p_7249fefe2495a5a6a4725d481e381b12_256x256_qual_100.webp&w=256&q=100"
          }
        />
      </div>
      <div className="">
        <ProfileInfo profile={profile} npub={npub} />
      </div>
      <div className="pt-2">
        <VerticalVideosFeed title="Videos" />
      </div>
    </div>
  );
}
