import type { SVGProps } from "react";

// const Logo = (props: SVGProps<SVGSVGElement>) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 100 39.8 57.5"
//     fill="currentColor"
//     {...props}
//   >
//     <path d="M0 100v30l15-15 17.723-.048c2.639-2.961 6.158-6.923 7.079-14.82L0 100ZM.252 139.892 16.8 123.5h15.3l-.015 7.049L.137 157.498z" />
//   </svg>
// );
const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    fill="currentColor"
    viewBox="0 0 320.1 512"
    {...props}
  >
    <linearGradient
      id="a"
      x1={-192.29}
      x2={518.33}
      y1={-112.583}
      y2={620.444}
      gradientUnits="userSpaceOnUse"
    >
      <stop
        offset={0}
        style={{
          stopColor: "#ff8e2b",
        }}
      />
      <stop
        offset={0.509}
        style={{
          stopColor: "#fb6232",
        }}
      />
      <stop
        offset={1}
        style={{
          stopColor: "#f83838",
        }}
      />
    </linearGradient>
    <path
      d="M306.5 230.1c-5.9-13.4-23.4-16.6-33.7-6.3l-70.5 70.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l64.5-64.4c43.1-43.1 27.6-132.8-39.3-180.6-13-9.3-31.1-1.1-32.8 14.7-3.3 30.1-21.8 81.6-102.8 162.5-1.6 1.6-3.2 3.5-4.8 5.6-.3.5-.7.9-1.1 1.3-56.2 62.8-54.1 159.2 6.2 219.5 46.8 46.7 78.1 78 98.5 98.4 8.1 8.1 21.3 8.1 29.4 0 15.7-15.7 45.9-45.8 98.4-98.4 48-47.9 59.1-118.9 33.3-177.4z"
      style={{
        fill: "url(#a)",
      }}
    />
  </svg>
);

export default Logo;
