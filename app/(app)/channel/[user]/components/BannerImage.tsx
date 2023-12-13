import Image from "next/image";

export default function BannerImage({ url }: { url?: string }) {
  return (
    <div className="relative min-h-[75px] w-full overflow-hidden rounded-xl bg-gradient-to-b from-primary pb-[21%]">
      {!!url && (
        <Image
          className="absolute inset-0 h-full w-full object-cover align-middle"
          src={url}
          width={400}
          height={100}
          alt="banner"
          unoptimized
        />
      )}
    </div>
  );
}
