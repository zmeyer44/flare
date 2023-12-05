export default function HeroSection() {
  return (
    <div className="flex flex-col px-5 pb-10 md:flex-row md:pb-20">
      <div className="flex-1">
        <h1 className="mt-14 text-5xl font-bold tracking-tight text-foreground sm:mt-10 md:text-6xl">
          Welcome to Flare, Lets Change the web
        </h1>
      </div>
      <div className="h-[150px] w-5/12 shrink-0 bg-orange-500"></div>
    </div>
  );
}
