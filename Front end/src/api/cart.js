import api from "./axios";

export const getCart = () => api.get("/cart");

export const addCartItem = (productId, quantity = 1) =>
  api.post("/cart/items", { productId, quantity });

export const updateCartItem = (productId, quantity) =>
  api.patch(`/cart/items/${productId}`, { quantity });

export const removeCartItem = (productId) => api.delete(`/cart/items/${productId}`);

export const clearCartApi = () => api.delete("/cart");
