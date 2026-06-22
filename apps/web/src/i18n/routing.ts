import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "nl"],
  defaultLocale: "nl",
  localeDetection: true,
  localePrefix: "always"
});
