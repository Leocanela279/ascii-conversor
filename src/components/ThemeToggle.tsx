import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/useTheme";
import { Button } from "./Button";

export function ThemeToggle() {
  const [theme, toggle] = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      icon={theme === "dark" ? Sun : Moon}
      onClick={toggle}
      className="ml-auto"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* icon-only below sm: the hero nav row has no room for the label */}
      <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
    </Button>
  );
}
