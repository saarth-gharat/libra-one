"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("libra-theme", next ? "dark" : "light");
    setDark(next);
  }

  if (!mounted) {
    return (
      <button className="btn btn-secondary icon-btn" type="button">
        <Sun size={18} />
        <span>Theme</span>
      </button>
    );
  }

  return (
    <button className="btn btn-secondary icon-btn" type="button" onClick={toggleTheme}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}