import axios from "axios";
import NotificationMessage from "./containers/components/common/notificationMessage";

let baseURL = "https://test-mern-be.onrender.com";

export const currentURL = baseURL;
const API = axios.create({
  baseURL,
  responseType: "json",
});

export default API;
// Axios Request interceptors
API.interceptors.request.use((req) => {
  const userToken = sessionStorage.getItem("token");
  if (userToken)
    req.headers = {
      Authorization: "Bearer " + userToken.replace(/^"|"$/g, ""),
    };
  if (process.env.NODE_ENV === "development") {
  }
  return req;
});

API.interceptors.response.use(
  (res) => {
    if (process.env.NODE_ENV === "development") {
    }
    return res;
  },
  (err) => {
    if (process.env.NODE_ENV === "development") {
    }
    if (err?.response?.status === 400) {
      // NotificationMessage("error", err?.response?.data?.message);
    }
    if (err?.response?.status === 404) {
      NotificationMessage("error", err?.response?.data?.message);
    }
    if (err?.response?.status === 422) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.errors &&
        err.response.data.errors.length > 0
      ) {
        err.response.data.errors.map((text, i) => {
          return Object.keys(text).forEach(function (key) {
            return NotificationMessage("error", `${text[key]}`);
          });
        });
      } else {
        NotificationMessage("error", err.response.data.message);
      }
    }
    if (err?.response?.status === 500) {
      NotificationMessage("error", err?.response?.data?.message);
    }
    if (err?.response?.status === 403) {
      NotificationMessage("error", err?.response?.data?.message);
    }
    if (err?.response?.status === 401) {
      console.log('called err')
      NotificationMessage("error", err?.response?.data?.message);
      sessionStorage.removeItem("token");
      history.push("/");
      window.location.reload();
    } else {
      // NotificationMessage("error", "internal Server Error");
    }
    return err;
  }
);
