import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use(
  (req) => {
    req.headers["Access-Control-Allow-Origin"] = "*";
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// this block of code can be used to add tokens and other authentication/headers
// or any other sort of modifictions in the API calls
instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { instance as default };
