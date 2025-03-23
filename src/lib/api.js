import Axios from "axios";
import {getServerSession} from "next-auth";
import {authOptions} from "./auth";
import {ErrTokenNotMatch} from "@/lib/constance";

const isDebug = process.env.NODE_ENV !== "production";

const api = Axios.create({
    baseURL: `${process.env.API_ROOT}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        if (isDebug) {
            // can output log here
        }

        const session = await getServerSession(authOptions);
        config.headers.Token = session?.user?.token || "";

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    async (response) => {
        if (isDebug) {
        }

        if (response.data.err) {
            throw {
                err: response.data.err,
                status: 401,
            };
        }

        return response.data;
    },
    (error) => {
        if (isDebug) {
            // can output log here
        }
        return Promise.reject(error);
    }
);

export default api;
