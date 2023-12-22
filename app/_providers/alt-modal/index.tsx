"use client";
import { Drawer } from "vaul";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MyDrawer() {
  const [showNested, setShowNested] = useState(false);
  return (
    <Drawer.Root shouldScaleBackground>
      <Drawer.Trigger asChild>
        <button>Open Drawer</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-[96%] flex-col rounded-t-[10px] bg-gray-100">
          <Leaflet openNested={() => setShowNested(true)} />
          <Drawer.Root
            open={showNested}
            nested={true}
            onClose={() => setTimeout(() => setShowNested(true), 300)}
          >
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40" />
              <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-full max-h-[94%] flex-col rounded-t-[10px] bg-gray-100">
                <div className="flex-1 rounded-t-[10px] bg-white p-4">
                  <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
                  <div className="mx-auto max-w-md">
                    <Drawer.Title className="mb-4 font-medium">
                      This drawer is nested.
                    </Drawer.Title>
                    <p className="mb-2 text-gray-600">
                      Place a{" "}
                      <span className="font-mono text-[15px] font-semibold">
                        `Drawer.NestedRoot`
                      </span>{" "}
                      inside another drawer and it will be nested automatically
                      for you.
                    </p>
                    <p className="mb-2 text-gray-600">
                      You can view more examples{" "}
                      <a
                        href="https://github.com/emilkowalski/vaul#examples"
                        className="underline"
                        target="_blank"
                      >
                        here
                      </a>
                      .
                    </p>
                  </div>
                </div>
                <div className="mt-auto border-t border-gray-200 bg-gray-100 p-4">
                  <div className="mx-auto flex max-w-md justify-end gap-6">
                    <a
                      className="gap-0.25 flex items-center text-xs text-gray-600"
                      href="https://github.com/emilkowalski/vaul"
                      target="_blank"
                    >
                      GitHub
                      <svg
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="16"
                        aria-hidden="true"
                        className="ml-1 h-3 w-3"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14L21 3"></path>
                      </svg>
                    </a>
                    <a
                      className="gap-0.25 flex items-center text-xs text-gray-600"
                      href="https://twitter.com/emilkowalski_"
                      target="_blank"
                    >
                      Twitter
                      <svg
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                        width="16"
                        aria-hidden="true"
                        className="ml-1 h-3 w-3"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14L21 3"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Leaflet({ openNested }: { openNested: () => void }) {
  return (
    <div className="">
      <div className="flex-1 rounded-t-[10px] bg-white p-4">
        <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
        <div className="mx-auto max-w-md">
          <Drawer.Title className="mb-4 font-medium">
            Drawer for React.
          </Drawer.Title>
          <p className="mb-2 text-gray-600">
            This component can be used as a Dialog replacement on mobile and
            tablet devices.
          </p>
          <p className="mb-2 text-gray-600">
            It comes unstyled and has gesture-driven animations.
          </p>
          <p className="mb-6 text-gray-600">
            It uses{" "}
            <a
              href="https://www.radix-ui.com/docs/primitives/components/dialog"
              className="underline"
              target="_blank"
            >
              Radix&rsquo;s Dialog primitive
            </a>{" "}
            under the hood and is inspired by{" "}
            <a
              href="https://twitter.com/devongovett/status/1674470185783402496"
              className="underline"
              target="_blank"
            >
              this tweet.
            </a>
          </p>

          <Button onClick={openNested}>Open Second Drawer</Button>
        </div>
      </div>
      <div className="mt-auto border-t border-gray-200 bg-gray-100 p-4">
        <div className="mx-auto flex max-w-md justify-end gap-6">
          <a
            className="gap-0.25 flex items-center text-xs text-gray-600"
            href="https://github.com/emilkowalski/vaul"
            target="_blank"
          >
            GitHub
            <svg
              fill="none"
              height="16"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="16"
              aria-hidden="true"
              className="ml-1 h-3 w-3"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              <path d="M15 3h6v6"></path>
              <path d="M10 14L21 3"></path>
            </svg>
          </a>
          <a
            className="gap-0.25 flex items-center text-xs text-gray-600"
            href="https://twitter.com/emilkowalski_"
            target="_blank"
          >
            Twitter
            <svg
              fill="none"
              height="16"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="16"
              aria-hidden="true"
              className="ml-1 h-3 w-3"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              <path d="M15 3h6v6"></path>
              <path d="M10 14L21 3"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
