"use client";

import React from "react";
import ReactDOM from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type {
  HeightT,
  ToastT,
  ToastToDismiss,
  ExternalToast,
  ToasterProps,
  ToastProps,
  ModalT,
} from "./types";
import { modal, ModalState } from "./state";

import {
  Drawer,
  DrawerPortal,
  DrawerContent,
  DrawerOverlay,
  DrawerNestedRoot,
} from "@/components/ui/drawer";

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  modal: ModalT;
  layer?: number;
  nestedModals: ModalT[];
  removeModal: (modal: ModalT) => void;
};
const Modal = ({
  modal,
  layer = 0,
  nestedModals,
  removeModal,
  ...props
}: ModalProps) => {
  const NestedModal = () => {
    if (nestedModals.length === 0) {
      return null;
    }
    return (
      <Dialog
        open={!!nestedModals.length}
        onOpenChange={(open) => {
          if (!open) {
            setTimeout(() => removeModal(nestedModals[0]!), 300);
          }
        }}
      >
        <DialogPortal>
          <DialogOverlay
            style={{
              zIndex: 940 + layer * 2,
            }}
            className="fixed inset-0 bg-black/40"
          />

          <Modal
            style={{
              zIndex: 940 + layer * 2,
            }}
            modal={nestedModals[0]!}
            layer={layer + 1}
            nestedModals={nestedModals.slice(1)}
            removeModal={removeModal}
          />
        </DialogPortal>
      </Dialog>
    );
  };
  return (
    <DialogContent {...props} className={modal.className}>
      {modal.jsx}
      <NestedModal />
    </DialogContent>
  );
};
const ModalDrawer = ({
  modal,
  layer = 0,
  nestedModals,
  removeModal,
}: {
  modal: ModalT;
  layer?: number;
  nestedModals: ModalT[];
  removeModal: (modal: ModalT) => void;
}) => {
  const maxHeight = 96 - 2 * layer;
  const NestedModal = () => {
    if (nestedModals.length === 0) {
      return null;
    }
    return (
      <DrawerNestedRoot
        open={!!nestedModals.length}
        onClose={() => {
          setTimeout(() => removeModal(nestedModals[0]!), 300);
        }}
      >
        <DrawerContent
          className={nestedModals[0]!.className}
          style={{
            maxHeight: `${maxHeight - 2}%`,
          }}
        >
          <ModalDrawer
            modal={nestedModals[0]!}
            layer={layer + 1}
            nestedModals={nestedModals.slice(1)}
            removeModal={removeModal}
          />
        </DrawerContent>
      </DrawerNestedRoot>
    );
  };
  return (
    <>
      {modal.jsx}
      <NestedModal />
    </>
  );
};
const Modstr = (props: ToasterProps) => {
  const [modals, setModals] = React.useState<ModalT[]>([]);

  const removeModal = React.useCallback(
    (modal: ModalT) =>
      setModals((modals) => modals.filter(({ id }) => id !== modal.id)),
    [],
  );

  React.useEffect(() => {
    return ModalState.subscribe((modal) => {
      if ((modal as ToastToDismiss).dismiss) {
        // setModals((modals) =>
        //   modals.map((t) => (t.id === modal.id ? { ...t, delete: true } : t)),
        // );
        setModals((modals) => modals.filter((t) => t.id !== modal.id));
        return;
      }
      // Prevent batching, temp solution.
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setModals((modals) => {
            const indexOfExistingToast = modals.findIndex(
              (t) => t.id === modal.id,
            );
            // Update the toast if it already exists
            if (indexOfExistingToast !== -1) {
              return [
                ...modals.slice(0, indexOfExistingToast),
                { ...modals[indexOfExistingToast], ...modals },
                ...modals.slice(indexOfExistingToast + 1),
              ] as ModalT[];
            }
            return [...modals, modal] as ModalT[];
          });
        });
      });
    });
  }, []);

  if (!modals.length) return null;
  const rootModal = modals[0]!;

  if (typeof window.innerWidth === "number" && window.innerWidth > 768) {
    return (
      <Dialog
        open={!!modals.length}
        onOpenChange={(open) => {
          if (!open) {
            setModals([]);
          }
        }}
      >
        <Modal
          modal={rootModal}
          nestedModals={modals.slice(1)}
          removeModal={removeModal}
        />
      </Dialog>
    );
  }
  return (
    <section aria-label={`modal-provider`} tabIndex={-1}>
      <Drawer
        open={!!modals.length}
        onClose={() => setModals([])}
        shouldScaleBackground={true}
      >
        <DrawerContent
          className={rootModal.className}
          style={{
            maxHeight: "96%",
          }}
        >
          <ModalDrawer
            modal={rootModal}
            nestedModals={modals.slice(1)}
            removeModal={removeModal}
          />
        </DrawerContent>
      </Drawer>
    </section>
  );
};
export { modal, Modstr, ToastT, ExternalToast };
