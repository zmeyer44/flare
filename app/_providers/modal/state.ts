import React from "react";
import type {
  ExternalToast,
  PromiseT,
  ToastToDismiss,
  ToastTypes,
  ModalT,
} from "./types";

let modalsCounter = 1;

class Observer {
  subscribers: Array<(modal: ExternalToast | ToastToDismiss) => void>;
  modals: Array<ModalT>;

  constructor() {
    this.subscribers = [];
    this.modals = [];
  }

  // We use arrow functions to maintain the correct `this` reference
  subscribe = (subscriber: (modal: ModalT | ToastToDismiss) => void) => {
    //@ts-ignore
    this.subscribers.push(subscriber);

    return () => {
      //@ts-ignore
      const index = this.subscribers.indexOf(subscriber);
      this.subscribers.splice(index, 1);
    };
  };

  publish = (data: ModalT) => {
    this.subscribers.forEach((subscriber) => subscriber(data));
  };

  addModal = (data: ModalT) => {
    this.publish(data);
    console.log("Adding modal", data);
    this.modals = [...this.modals, data];
  };

  create = (
    data: ExternalToast & {
      node?: React.ReactNode;
      type?: ToastTypes;
      promise?: PromiseT;
      jsx?: React.ReactElement;
      className?: string;
    },
  ) => {
    const { node, ...rest } = data;
    const id = data.id !== undefined ? data.id : modalsCounter++;
    const alreadyExists = this.modals.find((modal) => {
      return modal.id === id;
    });
    const dismissible =
      data.dismissible === undefined ? true : data.dismissible;

    if (alreadyExists) {
      this.modals = this.modals.map((modal) => {
        if (modal.id === id) {
          this.publish({ ...modal, ...data, id, jsx: node });
          return {
            ...modal,
            ...data,
            id,
            dismissible,
            jsx: node,
          };
        }

        return modal;
      });
    } else {
      this.addModal({ jsx: node, ...rest, dismissible, id });
    }
    return id;
  };

  dismiss = (id?: number | string) => {
    console.log("Dismiss called", id);
    if (!id) {
      this.modals.forEach((modal) => {
        this.subscribers.forEach((subscriber) =>
          subscriber({ id: modal.id, dismiss: true }),
        );
      });
    }
    this.subscribers.forEach((subscriber) => subscriber({ id, dismiss: true }));
    return id;
  };

  show = (node: React.ReactNode, data?: ExternalToast) => {
    return this.create({ ...data, node });
  };

  //   error = (message: string | React.ReactNode, data?: ExternalToast) => {
  //     return this.create({ ...data, message, type: "error" });
  //   };

  custom = (
    jsx: (id: number | string) => React.ReactElement,
    data?: ExternalToast,
  ) => {
    const id = data?.id || modalsCounter++;
    this.create({ jsx: jsx(id), id, ...data });
    return id;
  };
}

export const ModalState = new Observer();

// bind this to the toast function
const modalFunction = (node: React.ReactNode, data?: ExternalToast) => {
  const id = data?.id || modalsCounter++;

  ModalState.addModal({
    jsx: node,
    ...data,
    id,
  });
  return id;
};

const basicModal = modalFunction;

// We use `Object.assign` to maintain the correct types as we would lose them otherwise
export const modal = Object.assign(basicModal, {
  show: ModalState.show,
  dismiss: ModalState.dismiss,
  //   error: ModalState.error,
});
