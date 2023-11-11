"use client";

import Modal from ".";
import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

export enum Modals {}

type ModalsType = {
  [key in Modals]: (props: any) => JSX.Element;
};

const ModalOptions: ModalsType = {};

type ModalProps = ReactElement | Modals;

type ModalContextProps = {
  show: (content: ModalProps) => void;
  swap: (content: ModalProps) => void;
  hide: () => void;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [showModal, setShowModal] = useState(false);

  const show = (content: ModalProps) => {
    if (typeof content === "string" && ModalOptions[content]) {
      setModalContent(ModalOptions[content]);
    } else {
      setModalContent(content);
    }

    setShowModal(true);
  };

  const swap = (content: ModalProps) => {
    hide();
    setTimeout(() => {
      show(content);
    }, 300);
  };

  const hide = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300); // Adjust this timeout as per your transition duration
  };

  return (
    <div vaul-drawer-wrapper="" className="min-h-[100svh]">
      <ModalContext.Provider value={{ show, hide, swap }}>
        {children}
        {showModal && (
          <Modal showModal={showModal} setShowModal={setShowModal}>
            {modalContent}
          </Modal>
        )}
      </ModalContext.Provider>
    </div>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
