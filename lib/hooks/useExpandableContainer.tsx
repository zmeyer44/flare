import { useState, useEffect, useRef, ReactNode } from "react";
import { cn } from "../utils";

type ExpandableContainerProps = {
  maxHeight: number;
};

export default function useExpandableContainer({
  maxHeight,
}: ExpandableContainerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expandButton, setExpandButton] = useState<boolean | null>(null);
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      if (contentRef.current.scrollHeight > maxHeight) {
        setExpandButton(true);
      } else {
        setExpandButton(false);
      }
    }
  }, [contentRef.current, contentRef.current?.scrollHeight]);

  const ExpandButton = ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => {
    function onButtonClick() {
      setShowFull(true);
    }
    if (!showFull && expandButton) {
      return (
        <button type="button" className={className} onClick={onButtonClick}>
          {children}
        </button>
      );
    }
    return null;
  };

  return {
    renderButton: !showFull && expandButton,
    ExpandButton,
    contentRef: contentRef,
    containerStyles: {
      maxHeight: showFull || expandButton === false ? "none" : maxHeight + 5,
      overflow: "hidden",
    },
  };
}
