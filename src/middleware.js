// middleware.ts
import {getToken} from "next-auth/jwt";
import {withAuth} from "next-auth/middleware";
import {NextResponse} from "next/server";
import {AccountTypeCustomer, AccountTypeMember} from "./lib/constance";

const publicPages = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
const publicPathnameRegex = new RegExp(
    `^(${publicPages.map((path) => path.replace(/\//g, "\\/")).join("|")})$`
);

const authMiddleware = withAuth({
    callbacks: {
        authorized: ({token}) => !!token,
    },
    pages: {
        signIn: "/login",
    },
});

export async function middleware(req) {
    const {pathname, search} = req.nextUrl;

    if (search.includes("error=")) return NextResponse.next();

    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
    const accountType = token?.account_type?.toLowerCase();

    if (publicPathnameRegex.test(pathname)) {
        if (pathname.startsWith("/login") && token && !token.error) {
            if (accountType === AccountTypeMember || accountType === AccountTypeCustomer) {
                return NextResponse.redirect(new URL("/customer", req.url));
            } else {
                return NextResponse.redirect(new URL("/admin/orders", req.url));
            }
        }
        return NextResponse.next();
    }

    if (!token) return authMiddleware(req, NextResponse.next());

    if (
        (accountType === AccountTypeMember || accountType === AccountTypeCustomer) &&
        pathname.startsWith("/admin")
    ) {
        return NextResponse.redirect(new URL("/customer", req.url));
    }

    if (
        accountType &&
        accountType !== AccountTypeMember &&
        accountType !== AccountTypeCustomer &&
        pathname.startsWith("/customer")
    ) {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return authMiddleware(req, NextResponse.next());
}

export const config = {
    matcher: ["/((?!api|_next|.*\\..*).*)"],
};
