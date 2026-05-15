"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? resolvedTheme || theme : "dark";
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      className="h-9 w-9 grid place-items-center rounded-full glass hover:scale-105 transition"
    >
      {current === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
