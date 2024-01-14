"use client";

export default function RotaryButton() {
  return (
    <div className="m-auto flex h-40 w-40 scale-75 transform text-center">
      <div className="center absolute inset-x-0 -top-10">
        <p className="font-semibold text-gray-600">Fee Rate</p>
      </div>
      <div className="absolute h-40 w-40 origin-center -rotate-90 scale-110  transform font-semibold text-gray-600">
        500
      </div>
      <div className="absolute h-40 w-40 origin-center -rotate-45 scale-110 transform font-semibold text-gray-600">
        1K
      </div>
      <div className="absolute h-40 w-40 origin-center scale-110 transform font-semibold text-gray-600">
        2K
      </div>
      <div className="absolute h-40 w-40 origin-center rotate-45 scale-110 transform font-semibold text-gray-600">
        5K
      </div>
      <div className="absolute h-40 w-40 origin-center rotate-90 scale-110 transform font-semibold text-gray-600">
        10K
      </div>

      <div className="bg-texture-otis-redding relative m-auto h-24 w-24 rounded-full bg-primary bg-opacity-80">
        <div className="absolute h-24 w-24 scale-125 transform rounded-full border-2 border-gray-600"></div>
        <div className="absolute h-24 w-24 rounded-full border-l-2 border-r-2 border-t-2 border-white border-opacity-50"></div>
        <div className="absolute h-24 w-24 rounded-full border-b-2 border-l-2 border-r-2 border-black border-opacity-25"></div>
        <div className="bg-texture-otis-redding absolute m-auto ml-12 mt-12 h-1 w-1/2 origin-top-left -rotate-45 transform rounded-md bg-gray-200 bg-opacity-90"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-2xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-2xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-lg"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-md"></div>
      </div>
    </div>
  );
}
