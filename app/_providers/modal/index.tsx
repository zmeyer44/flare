"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FocusTrap from "focus-trap-react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaflet } from "./leaflet";
import useWindowSize from "@/lib/hooks/useWindowSize";

export default function Modal({
  children,
  showModal,
  setShowModal,
}: {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModal(false);
      }
    },
    [setShowModal],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  // const { isMobile, isDesktop } = useWindowSize();

  // useEffect(() => {
  //   if (showModal) {
  //     document.body.style.top = `-${window.scrollY}px`;
  //     document.body.style.position = "fixed";
  //   } else {
  //     const scrollY = document.body.style.top;
  //     document.body.style.position = "";
  //     document.body.style.top = "";
  //     window.scrollTo(0, parseInt(scrollY || "0") * -1);
  //   }
  //   return () => {
  //     const scrollY = document.body.style.top;
  //     document.body.style.position = "";
  //     document.body.style.top = "";
  //     window.scrollTo(0, parseInt(scrollY || "0") * -1);
  //   };
  // }, [showModal]);

  if (showModal) {
    if (typeof window.innerWidth === "number" && window.innerWidth < 768) {
      return (
        <Leaflet setShow={setShowModal} open={showModal}>
          {children}
        </Leaflet>
      );
    } else {
      return (
        <Dialog open={showModal} onOpenChange={(open) => setShowModal(open)}>
          <DialogContent>{children}</DialogContent>
        </Dialog>
      );
    }
  }
  return null;
}
