import api from "./axios";

export const getProducts = (params = {}) => api.get("/products", { params });

export const getProductById = (id) => api.get(`/products/${id}`);

export const getCategories = () => api.get("/products/categories/list");

export const getFeaturedProducts = () => api.get("/products", { params: { featured: true, limit: 4 } });

export const getLatestProducts = () => api.get("/products", { params: { sort: "newest", limit: 5 } });

// getProducts({ category: "Electronics" });
// getProducts();

 