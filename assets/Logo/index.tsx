import type { SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 100 39.8 57.5"
    fill="currentColor"
    {...props}
  >
    <path d="M0 100v30l15-15 17.723-.048c2.639-2.961 6.158-6.923 7.079-14.82L0 100ZM.252 139.892 16.8 123.5h15.3l-.015 7.049L.137 157.498z" />
  </svg>
);

export default Logo;
