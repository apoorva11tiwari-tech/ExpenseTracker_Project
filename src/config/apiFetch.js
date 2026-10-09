
import API_URL from "./api";
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";

const waitForAuthUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();

        if (user) {
          resolve(user);
        } else {
          reject(new Error("Please log in to continue."));
        }
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
};

const apiFetch = async (path, options = {}) => {
  let user = auth.currentUser;

  if (!user) {
    user = await waitForAuthUser();
  }

  const token = await user.getIdToken();

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
};

export default apiFetch;
