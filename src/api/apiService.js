import axiosClient from "./axiosClient";
import apiUris from "./apiUris";

/**
 * Centralized API Service
 * Groups all service wrappers (auth, blog, categories, etc.)
 * into one single object for easy import and usage.
 */
const apiService = {
  // 🔹 Auth
  auth: {
    login: (credentials) => axiosClient.post(apiUris.auth.login, credentials),
    register: (data) => axiosClient.post(apiUris.auth.register, data),
    googleLogin: (token) => axiosClient.post(apiUris.auth.google, { token }),
    refresh: () => axiosClient.post(apiUris.auth.refresh),
    logout: () => axiosClient.post(apiUris.auth.logout),
  },

  // 🔹 Blog
  blog: {
    getAll: () => axiosClient.get(apiUris.blog.getAll),
    create: (data) => axiosClient.post(apiUris.blog.create, data),
    getById: (id) => axiosClient.get(apiUris.blog.getById(id)),
    getBySlug: (slug) => axiosClient.get(apiUris.blog.getBySlug(slug)),
    getByStatus: (status) => axiosClient.get(apiUris.blog.getByStatus(status)),
    getByCategory: (cat) => axiosClient.get(apiUris.blog.getByCategory(cat)),
    update: (id, data) => axiosClient.put(apiUris.blog.update(id), data),
    delete: (id) => axiosClient.delete(apiUris.blog.delete(id)),
  },

  // 🔹 Categories
  categories: {
    getAll: () => axiosClient.get(apiUris.categories.getAll),
    create: (data) => axiosClient.post(apiUris.categories.create, data),
    getById: (id) => axiosClient.get(apiUris.categories.getById(id)),
    update: (id, data) => axiosClient.put(apiUris.categories.update(id), data),
    delete: (id) => axiosClient.delete(apiUris.categories.delete(id)),
  },

  // 🔹 Clients
  clients: {
    getAll: () => axiosClient.get(apiUris.clients.getAll),
    create: (data) => axiosClient.post(apiUris.clients.create, data),
    update: (id, data) => axiosClient.put(apiUris.clients.update(id), data),
    delete: (id) => axiosClient.delete(apiUris.clients.delete(id)),
  },

  // 🔹 Inquiries
  inquiries: {
    submit: (data) => axiosClient.post(apiUris.inquiries.submit, data),
    getAll: () => axiosClient.get(apiUris.inquiries.getAll),
    filter: (params) =>
      axiosClient.get(apiUris.inquiries.filter, { params }), // query params
    getById: (id) => axiosClient.get(apiUris.inquiries.getById(id)),
    markAsHandled: (id) => axiosClient.put(apiUris.inquiries.markAsHandled(id)),
    delete: (id) => axiosClient.delete(`inquiries/${id}`), // DELETE
  },

  // 🔹 Services
  services: {
    getAll: () => axiosClient.get(apiUris.services.getAll),
    create: (data) => axiosClient.post(apiUris.services.create, data),
    getById: (id) => axiosClient.get(apiUris.services.getById(id)),
    update: (id, data) => axiosClient.put(apiUris.services.update(id), data),
    delete: (id) => axiosClient.delete(apiUris.services.delete(id)),
  },

  // 🔹 Testimonials
  testimonials: {
    getAll: () => axiosClient.get(apiUris.testimonials.getAll),
    create: (data) => axiosClient.post(apiUris.testimonials.create, data),
    update: (id, data) => axiosClient.put(apiUris.testimonials.update(id), data),
    delete: (id) => axiosClient.delete(apiUris.testimonials.delete(id)),
  },
};

export default apiService;
