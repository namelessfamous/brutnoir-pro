import React from "react";
import { darkTheme, lightTheme } from "./index";

function buildCssString(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
}

export const darkThemeCss = `:root {\n${buildCssString(darkTheme)}\n}`;
export const lightThemeCss = `:root {\n${buildCssString(lightTheme)}\n}`;

interface GlobalStylesProps {
  theme?: "dark" | "light";
}

export function GlobalStyles({ theme = "dark" }: GlobalStylesProps): React.ReactElement {
  const css = theme === "dark" ? darkThemeCss : lightThemeCss;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
