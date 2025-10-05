
const KEY = "token";
export const getToken = () => localStorage.getItem(KEY);
export const setToken = (token) => localStorage.setItem(KEY, token);
export const clearToken = () => localStorage.removeItem(KEY);

export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function getUserData() {
    const token = getToken();
    if (!token) return null;
    const data = parseJwt(token);
    console.log("Token data:", data); // <-- agrega esto
    return data;
}

export function isTokenExpired() {
    const data = getUserData();
    if (!data || !data.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return data.exp < now;
}