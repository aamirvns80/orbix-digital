import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnPortal = nextUrl.pathname.startsWith("/portal");
            const isOnAuth =
                nextUrl.pathname.startsWith("/login") ||
                nextUrl.pathname.startsWith("/register");

            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                const role = (auth?.user as any)?.role;
                if (role !== "admin") {
                    return Response.redirect(new URL("/dashboard", nextUrl));
                }
                return true;
            }

            if (isOnDashboard) {
                if (!isLoggedIn) return false;
                const role = (auth?.user as any)?.role;
                // Clients shouldn't access the internal dashboard
                if (role === "client") {
                    return Response.redirect(new URL("/portal", nextUrl));
                }
                return true;
            }

            if (isOnPortal) {
                if (!isLoggedIn) return false;
                return true;
            }

            if (isOnAuth && isLoggedIn) {
                const role = (auth?.user as any)?.role;
                if (role === "client") {
                    return Response.redirect(new URL("/portal", nextUrl));
                }
                return Response.redirect(new URL("/dashboard", nextUrl));
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.companyId = (user as any).companyId;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                (session.user as any).role = token.role as string;
                (session.user as any).companyId = token.companyId as string | null;
            }
            return session;
        },
    },
    providers: [], // Providers added in auth.ts for Node.js runtime
} satisfies NextAuthConfig;
