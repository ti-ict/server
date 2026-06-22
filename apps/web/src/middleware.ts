// middleware.ts  (at the project root, next to package.json)
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing"; // adjust path if needed

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
