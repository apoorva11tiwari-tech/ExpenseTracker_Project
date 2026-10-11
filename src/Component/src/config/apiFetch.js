import { auth } from "../firebase";

const API_BASE_URL = "http://localhost:5000";

async function apiFetch(endpoint, options = {}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please log in again. Firebase user not found.");
  }

  const token = await user.getIdToken(true);

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export default apiFetch;