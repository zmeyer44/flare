"use client";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { Drawer } from "vaul";

export function Leaflet({
  children,
  open,
  setShow,
}: {
  children: ReactNode;
  open: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Drawer.Root
      open={open}
      dismissible
      onClose={() => setShow(false)}
      shouldScaleBackground
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-zinc-100">
          <div className="flex-1 rounded-t-[10px] bg-background p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="mx-auto max-w-md">{children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
