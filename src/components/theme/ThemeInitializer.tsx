"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("libra-theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      return;
    }

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  return null;
}