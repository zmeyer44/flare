/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/no-unsafe-assignment: "off" */
/* eslint @typescript-eslint/no-unsafe-call: "off" */
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

const QrCode = ({ code }: { code: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="center rounded-[50px] bg-gradient-to-br from-orange-500 via-orange-600 to-orange-600 p-5 shadow-md">
        <div className="center rounded-[35px] bg-white p-6">
          <QRCode value={code} />
        </div>
      </div>
    </div>
  );
};

export default QrCode;
