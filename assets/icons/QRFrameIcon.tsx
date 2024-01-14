import type { SVGProps } from "react";
const QRFrameIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" {...props}>
    <path
      fill="none"
      d="M13,0 L0,0 L0,13"
      stroke="currentColor"
      strokeWidth={5}
    />
    <path
      fill="none"
      d="M0,87 L0,100 L13,100"
      stroke="currentColor"
      strokeWidth={5}
    />
    <path
      fill="none"
      d="M87,100 L100,100 L100,87"
      stroke="currentColor"
      strokeWidth={5}
    />
    <path
      fill="none"
      d="M100,13 L100,0 87,0"
      stroke="currentColor"
      strokeWidth={5}
    />
  </svg>
);
export default QRFrameIcon;
