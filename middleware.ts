import { withAuth } from "next-auth/middleware";
import { AppRoutes } from "@/types/enums";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = { matcher: [AppRoutes.DASHBOARD] };

