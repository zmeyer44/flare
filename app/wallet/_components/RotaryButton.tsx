"use client";
import { useState, useEffect } from "react";
import useLongPress from "../_hooks/useLongPress";
import useDeviceInfo from "../_hooks/useDeviceInfo";

export default function RotaryButton() {
  const info = useDeviceInfo();
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSafari(
        // @ts-ignore
        /constructor/i.test(window?.HTMLElement) ||
          (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
          })(
            // @ts-ignore
            !window["safari"] ||
              // @ts-ignore
              (typeof safari !== "undefined" && safari?.pushNotification),
          ),
      );
    }
  }, [info]);
  const [rotation, setRotation] = useState(-150);
  function getSafariVal(num: number) {
    if (num <= 180) return num;
    return -180 + (num - 180);
  }
  function handleRotate() {
    if (isSafari || info?.osName === "iOS") {
      setRotation((prev) => {
        const val = getSafariVal(prev);
        if (val === -150) {
          return -90;
        } else if (val === -90) {
          return -30;
        } else {
          return -150;
        }
      });
    } else {
      setRotation((prev) => {
        const val = getSafariVal(prev);
        if (val === -150) {
          return -90;
        } else if (val === -90) {
          return -30;
        } else {
          return -150;
        }
      });
      //   setRotation((prev) => {
      //     const remainder = prev % 180;
      //     if (remainder === 30) {
      //       return prev + 60;
      //     } else if (remainder === 90) {
      //       return prev + 60;
      //     } else {
      //       return prev + 240;
      //     }
      //   });
    }
  }
  function handleSelect() {
    let step = "send";
    const remainder = rotation % 180;
    if (remainder === -90) {
      step = "scan";
    } else if (remainder === -30) {
      step = "show";
    }
    alert(`Selected ${step} ${remainder}`);
  }

  const defaultOptions = {
    shouldPreventDefault: true,
    delay: 500,
  };
  const longPressEvent = useLongPress(
    handleSelect,
    handleRotate,
    defaultOptions,
  );
  return (
    <div className="m-auto flex h-40 w-40 scale-150 transform select-none text-center">
      <div className="center absolute inset-x-0 -top-12">
        <p className="font-semibold uppercase text-gray-600">Action Switch</p>
      </div>
      <div
        style={{
          rotate: `-60deg`,
        }}
        className="absolute h-40 w-40 origin-center scale-110 transform text-sm font-semibold uppercase text-gray-600"
      >
        Send
      </div>
      {/* <div className="absolute h-40 w-40 origin-center -rotate-45 scale-110 transform font-semibold text-gray-600">
        200
      </div> */}
      <div className="absolute h-40 w-40 origin-center scale-110 transform text-sm font-semibold uppercase text-gray-600">
        Scan
      </div>
      {/* <div className="absolute h-40 w-40 origin-center rotate-45 scale-110 transform font-semibold text-gray-600">
        1K
      </div> */}
      <div
        style={{
          rotate: `60deg`,
        }}
        className="absolute h-40 w-40 origin-center scale-110 transform text-sm font-semibold uppercase text-gray-600"
      >
        Show
      </div>
      {/* @ts-ignore */}
      <div
        {...longPressEvent}
        className="bg-texture-otis-redding relative m-auto h-24 w-24 rounded-full bg-primary bg-opacity-80"
      >
        <div className="absolute h-24 w-24 scale-125 transform rounded-full border-2 border-gray-600"></div>
        <div className="absolute h-24 w-24 rounded-full border-l-2 border-r-2 border-t-2 border-white border-opacity-50"></div>
        <div className="absolute h-24 w-24 rounded-full border-b-2 border-l-2 border-r-2 border-black border-opacity-25"></div>
        <div
          style={{
            rotate: `${rotation}deg`,
          }}
          className="bg-texture-otis-redding absolute m-auto mb-[-4px] ml-12 mt-12 h-1 w-1/2 origin-top-left -translate-x-1 transform transition-all duration-200"
        >
          <div className="ml-auto h-1 w-4/5 -translate-y-[3px] transform rounded-md bg-gray-200 bg-opacity-90"></div>
        </div>

        <div className="absolute h-24 w-24 rounded-full shadow-2xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-2xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-xl"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-lg"></div>
        <div className="absolute h-24 w-24 rounded-full shadow-md"></div>
      </div>
      <div className="center absolute inset-x-0 -bottom-5">
        <p className="text-[12px] font-semibold uppercase text-gray-600">
          [Hold to select]
        </p>
      </div>
    </div>
  );
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

      <div
        onClick={() => {
          setRotation((prev) => prev + 30);
        }}
        className="bg-texture-otis-redding relative m-auto h-24 w-24 rounded-full bg-primary bg-opacity-80"
      >
        <div className="absolute h-24 w-24 scale-125 transform rounded-full border-2 border-gray-600"></div>
        <div className="absolute h-24 w-24 rounded-full border-l-2 border-r-2 border-t-2 border-white border-opacity-50"></div>
        <div className="absolute h-24 w-24 rounded-full border-b-2 border-l-2 border-r-2 border-black border-opacity-25"></div>
        <div
          style={{
            rotate: `${rotation}deg`,
          }}
          className="bg-texture-otis-redding absolute m-auto ml-12 mt-12 h-1 w-1/2 origin-top-left -rotate-45 transform rounded-md bg-gray-200 bg-opacity-90 transition-all"
        ></div>
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
