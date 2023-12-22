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
import { Drawer } from "vaul";

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const Modal = ({
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
          <DialogOverlay className="fixed inset-0 bg-black/40" />
          <Modal
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
    <DialogContent>
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
      <Drawer.NestedRoot
        open={!!nestedModals.length}
        onClose={() => {
          setTimeout(() => removeModal(nestedModals[0]!), 300);
        }}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-overlay bg-black/40" />
          <ModalDrawer
            modal={nestedModals[0]!}
            layer={layer + 1}
            nestedModals={nestedModals.slice(1)}
            removeModal={removeModal}
          />
        </Drawer.Portal>
      </Drawer.NestedRoot>
    );
  };
  return (
    <Drawer.Content
      className="fixed bottom-0 left-0 right-0 z-modal mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background outline-none focus-visible:outline-none"
      style={{
        maxHeight: `${maxHeight}%`,
      }}
    >
      <div className="mx-auto mb-3 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
      {modal.jsx}
      <NestedModal />
    </Drawer.Content>
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
    // Remove item from normal navigation flow, only available via hotkey
    <>
      <section aria-label={`modal-provider`} tabIndex={-1}>
        <Drawer.Root
          open={!!modals.length}
          onClose={() => setModals([])}
          shouldScaleBackground
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-overlay bg-black/40" />
            <ModalDrawer
              modal={rootModal}
              nestedModals={modals.slice(1)}
              removeModal={removeModal}
            />
          </Drawer.Portal>
        </Drawer.Root>
      </section>
      {/* <section
        aria-label={`${containerAriaLabel} ${hotkeyLabel}`}
        tabIndex={-1}
      >
        {possiblePositions.map((position, index) => {
          const [y, x] = position.split("-");
          return (
            <ol
              key={position}
              dir={dir === "auto" ? getDocumentDirection() : dir}
              tabIndex={-1}
              ref={listRef}
              className={className}
              data-sonner-toaster
              data-rich-colors={richColors}
              data-y-position={y}
              data-x-position={x}
              style={
                {
                  "--front-toast-height": `${heights[0]?.height}px`,
                  "--offset":
                    typeof offset === "number"
                      ? `${offset}px`
                      : offset || VIEWPORT_OFFSET,
                  "--width": `${TOAST_WIDTH}px`,
                  "--gap": `${GAP}px`,
                  ...style,
                } as React.CSSProperties
              }
              onBlur={(event) => {
                if (
                  isFocusWithinRef.current &&
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  isFocusWithinRef.current = false;
                  if (lastFocusedElementRef.current) {
                    lastFocusedElementRef.current.focus({
                      preventScroll: true,
                    });
                    lastFocusedElementRef.current = null;
                  }
                }
              }}
              onFocus={(event) => {
                const isNotDismissible =
                  event.target instanceof HTMLElement &&
                  event.target.dataset.dismissible === "false";

                if (isNotDismissible) return;

                if (!isFocusWithinRef.current) {
                  isFocusWithinRef.current = true;
                  lastFocusedElementRef.current =
                    event.relatedTarget as HTMLElement;
                }
              }}
              onMouseEnter={() => setExpanded(true)}
              onMouseMove={() => setExpanded(true)}
              onMouseLeave={() => {
                // Avoid setting expanded to false when interacting with a toast, e.g. swiping
                if (!interacting) {
                  setExpanded(false);
                }
              }}
              onPointerDown={(event) => {
                const isNotDismissible =
                  event.target instanceof HTMLElement &&
                  event.target.dataset.dismissible === "false";

                if (isNotDismissible) return;
                setInteracting(true);
              }}
              onPointerUp={() => setInteracting(false)}
            >
              {toasts
                .filter(
                  (toast) =>
                    (!toast.position && index === 0) ||
                    toast.position === position,
                )
                .map((toast, index) => (
                  <Toast
                    key={toast.id}
                    index={index}
                    toast={toast}
                    duration={toastOptions?.duration ?? duration}
                    className={toastOptions?.className}
                    descriptionClassName={toastOptions?.descriptionClassName}
                    invert={!!invert}
                    visibleToasts={visibleToasts}
                    closeButton={!!closeButton}
                    interacting={interacting}
                    position={position}
                    style={toastOptions?.style}
                    unstyled={toastOptions?.unstyled}
                    classNames={toastOptions?.classNames}
                    cancelButtonStyle={toastOptions?.cancelButtonStyle}
                    actionButtonStyle={toastOptions?.actionButtonStyle}
                    removeToast={removeToast}
                    toasts={toasts}
                    heights={heights}
                    setHeights={setHeights}
                    expandByDefault={!!expand}
                    gap={gap}
                    loadingIcon={loadingIcon}
                    expanded={expanded}
                  />
                ))}
            </ol>
          );
        })}
      </section> */}
    </>
  );
};
export { modal, Modstr, ToastT, ExternalToast };
