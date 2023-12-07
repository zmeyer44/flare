import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { truncateText } from "@/lib/utils";

export const config = {
  runtime: "edge",
};
const BASE_URL = "https://fmon.io";

const fontBold = fetch(
  `${new URL(
    "../../../../public/fonts/DMSans-Bold.ttf",
    import.meta.url,
  ).toString()}`,
).then((res) => res.arrayBuffer());

async function getBase64(url: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/conver?url=${url}`);
    if (response.status === 200) {
      const json = (await response.json()) as { data: string };
      return json["data"] ?? "";
    }
    return "";
  } catch (err) {
    console.log("Error", err);
  }
  return "";
}

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id") as string;
  const name = searchParams.get("n") as string;
  const username = searchParams.get("u") as string;
  const address = searchParams.get("a") as string;
  const imageUrl: string = await getBase64(
    `https://ordin.s3.amazonaws.com/inscriptions/${id}`,
  );

  const fontDataBold = await fontBold;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "0px",
            width: "750px",
            height: "300px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              borderRadius: "30px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0px 7px 100px 0px #d946ef",
                backgroundColor: "#9e339e",
              }}
            >
              <img
                src={imageUrl}
                alt="image"
                style={{
                  objectPosition: "center",
                  objectFit: "contain",
                  overflow: "hidden",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "55px",
            fontFamily: '"CustomBold"',
          }}
        >
          <h1
            style={{
              marginBottom: "0",
            }}
          >
            {name}
          </h1>
          <span
            style={{
              marginLeft: "15px",
              marginTop: "35px",
              marginBottom: "0",
              color: "#ec5ae5",
              fontSize: "40px",
            }}
          >
            @{username}
          </span>
        </div>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            width: "40%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {/* <h3
                style={{
                  marginTop: "0",
                  marginBottom: "0",
                  color: "#676d79",
                  fontSize: "35px",
                  fontWeight: "bold",
                }}
              >
                {s.name}
              </h3> */}
            <h2
              style={{
                marginTop: "0",
                marginBottom: "0",
                color: "#676d79",
                fontSize: "40px",
              }}
            >
              {address}
            </h2>
          </div>
          {/* {stats.map((s) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <h3
                style={{
                  marginTop: "0",
                  marginBottom: "0",
                  color: "#676d79",
                  fontSize: "35px",
                  fontWeight: "bold",
                }}
              >
                {s.name}
              </h3>
              <h2
                style={{
                  marginTop: "10px",
                  marginBottom: "0",
                  color: "white",
                  fontSize: "40px",
                }}
              >
                {s.value}
              </h2>
            </div>
          ))} */}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
      fonts: [
        {
          name: "CustomBold",
          data: fontDataBold,
          style: "normal",
        },
      ],
    },
  );
}
