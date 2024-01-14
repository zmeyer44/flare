import { useEffect, useState } from "react";
import {
  browserName,
  deviceType,
  osName,
  osVersion,
} from "react-device-detect";

// contains all relevant info about the device, for troubleshooting Notifications
export type DeviceInfo = {
  standalone: boolean;
  browserName: string;
  osName: string;
  deviceType: string;
  isPrivate: boolean;
  osVersion: string;
  notificationApiPermissionStatus: string;
  serviceWorkerStatus: string;
  subscriptionState: "pending" | "subscribed" | "unsubscribed";
};

export default function useDeviceInfo() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  useEffect(() => {
    // initialize device info
    setInfo({
      standalone: window.matchMedia("(display-mode: standalone)").matches, // true if PWA is installed
      browserName,
      osName,
      deviceType,
      osVersion,
      isPrivate: false,
      // note that user may still not have granted notification permissions on a system settings level
      notificationApiPermissionStatus:
        typeof Notification !== "undefined"
          ? Notification.permission
          : "Notification API unsupported",
      serviceWorkerStatus: "fetching",
      subscriptionState: "pending",
    });
  }, []);

  return info;
}
