const SERVER_ORIGIN = import.meta.env.VITE_API_URL.replace("/api", "");

export const resolveProductImage = (path) =>
  /^https?:\/\//.test(path) ? path : `${SERVER_ORIGIN}${path}`;
