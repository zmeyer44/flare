"use client";

import { ReactNode } from "react";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerBody,
} from "@/components/ui/drawer";
export default function Template({
  children,
  footer,
  title,
  description,
}: {
  children: ReactNode;
  footer?: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="">
      {!!title && (
        <DrawerHeader>
          <DrawerTitle className="text-xl">{title}</DrawerTitle>
          {!!description && (
            <DrawerDescription>{description}</DrawerDescription>
          )}
        </DrawerHeader>
      )}
      <DrawerBody>{children}</DrawerBody>
      {!!footer && <DrawerFooter>{footer}</DrawerFooter>}
    </div>
  );
}
