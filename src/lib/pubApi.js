import Axios from "axios";

const isDebug = process.env.NODE_ENV !== "production";

const pubApi = Axios.create({
    baseURL: `${process.env.API_ROOT}`,
    headers: {
        "Content-Type": "application/json",
    },
});

pubApi.interceptors.request.use(
    async (config) => {
        if (isDebug) {
            // can output log here
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

pubApi.interceptors.response.use(
    async (response) => {
        if (isDebug) {
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

export default pubApi;
