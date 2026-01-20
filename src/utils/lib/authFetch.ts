import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function authFetch(
  url: string,
  options: RequestInit,
  router: AppRouterInstance
) {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/signin");
    throw new Error("Nicht authentifiziert");
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
    throw new Error("Session abgelaufen");
  }

  if (res.status === 403) {
    throw new Error("Zugriff verweigert");
  }

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res;
}
