"use client";

import { type ComponentType } from "react";
import dynamic from "next/dynamic";
import { type Event } from "nostr-tools";

const KindCard1 = dynamic(() => import("./1"), {
  ssr: false,
});
const KindCardDefault = dynamic(() => import("./1"), {
  ssr: false,
});

const componentMap: Record<number, ComponentType<KindCardProps>> = {
  1: KindCard1,
};

export type KindCardProps = Event<number> & {
  locked?: boolean;
  className?: string;
};
export default function KindCard(props: KindCardProps) {
  const { kind } = props;
  const KindCard_ = componentMap[kind] ?? KindCardDefault;
  return <KindCard_ {...props} />;
}
