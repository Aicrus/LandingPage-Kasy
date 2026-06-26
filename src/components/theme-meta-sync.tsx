import { THEME_BACKGROUND, themeMetaSyncScript } from "@/lib/theme-color";

export function ThemeMetaSyncScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${themeMetaSyncScript.toString()})(${JSON.stringify(THEME_BACKGROUND)})`,
      }}
    />
  );
}
