// authOptions.js
import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";

const root_api = process.env.API_ROOT;
const root_customer_api = "http://147.93.106.119:5801";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req) {
                const {username, password} = credentials ?? {};
                const data = {username, password};

                const configLogin = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    url: `${root_api}/login`,
                    data: JSON.stringify(data),
                };

                const resLogin = await axios.request(configLogin);

                if (resLogin.data.err) {
                    throw new Error(resLogin.data.err);
                }

                return {
                    id: username,
                    name: username,
                    email: "customer@gmail.com",
                    token: resLogin.data.data.token,
                    account_type: "customer",
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                return {
                    ...token,
                    ...user,
                };
            }
            return token;
        },
        async session({session, token}) {
            session.user = {
                ...session.user,
                token: token.token,
                name: token.name,
                email: token.email,
                account_type: token.account_type,
            };
            return session;
        },
    },
};
