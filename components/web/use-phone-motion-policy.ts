"use client";

import { useEffect, useState } from "react";

const PHONE_MEDIA_QUERY = "(max-width: 767px)";

export function usePhoneMotionPolicy(): boolean {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(PHONE_MEDIA_QUERY);
    const updateMatch = () => {
      setIsPhone(mediaQuery.matches);
    };

    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);

    return () => {
      mediaQuery.removeEventListener("change", updateMatch);
    };
  }, []);

  return isPhone;
}
