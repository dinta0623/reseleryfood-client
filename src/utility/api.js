import axios from "axios";
import { useStorage } from "./storage";
import { logoutUser } from "@/store/UserSlice";
import { store } from "../store/index";

export const headers = {
  "Access-Control-Allow-Origin": "*",
  "Content-type": "application/json",
};

export const useApi = axios.create({
  baseURL: import.meta.env.VITE_DATABASE_URL,
  headers,
});

const retry = axios.create({
  baseURL: import.meta.env.VITE_DATABASE_URL,
  headers,
});

useApi.interceptors.request.use(async (config) => {
  const token = await useStorage("credentials");
  // console.log("token", token);
  if (token?.access_token) {
    config.headers = {
      Authorization: `Bearer ${token.access_token}`,
    };
    // console.log(config.headers);
  }
  process.env.NODE_ENV === "development" &&
    console.log("Making request to " + config.url);
  return config;
});

useApi.interceptors.response.use(
  (result) => {
    return result.data || result;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      (error.response &&
        Boolean(error.response.status === 401 || error.response.status === 500))
    ) {
      // if (useRouter.currentRoute.value.fullPath.includes("/app")) {
      // await useUserStore().logoutUser();
      // }
      await store.dispatch(logoutUser());

      return Promise.reject(
        error?.response || new Error("Permintaan Timeout!")
      );
    }

    if (error.response && error.response.status === 404) {
      location.href = "*";
      return Promise.reject(error?.response);
    }

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const token = async () => {
        let token = await useStorage("credentials");
        // console.log("regenerate", token);
        if (token) {
          token = token.refresh_token;
          const { data } = await retry
            .post(`/token`, {
              token,
            })
            .catch(async () => {
              await useStorage("credentials", null);
              await store.dispatch(logoutUser());
            });
          // console.log(data);
          if (data?.result) {
            await useStorage("credentials", {
              access_token: data?.result,
              refresh_token: token,
            });
            token = data?.result;
          }
        }
        return token;
      };
      await token();
      return await useApi(originalRequest);
    }

    return Promise.reject(error?.response);
  }
);
