/**
 * Centralized API URI repository.
 * This file exports a single object containing all API endpoints for the application.
 * Using this file ensures consistency and makes it easy to update endpoints in one place.
 *
 * Usage:
 *
 * For static routes:
 * import apiUris from './apiUri';
 * const loginUrl = apiUris.auth.login; // "auth/login"
 *
 * For dynamic routes (with parameters):
 * import apiUris from './apiUri';
 * const blogPostUrl = apiUris.blog.getById('someMongoId'); // "blog/id/someMongoId"
 * const categoryUrl = apiUris.categories.update('someCategoryId'); // "categories/someCategoryId"
 */

const apiUris = {
  // Authentication Endpoints
  auth: {
    register: "auth/register",
    login: "auth/login",
    google: "auth/google",
    refresh: "auth/refresh",
    logout: "auth/logout",
  },

  // Blog Post Endpoints
  blog: {
    getAll: "blog",
    create: "blog",
    getById: (id) => `blog/id/${id}`,
    getBySlug: (slug) => `blog/slug/${slug}`,
    getByStatus: (status) => `blog/status/${status}`,
    getByCategory: (category) => `blog/category/${category}`,
    update: (id) => `blog/${id}`,
    delete: (id) => `blog/${id}`,
  },

  // Category Endpoints
  categories: {
    getAll: "categories",
    create: "categories",
    getById: (id) => `categories/${id}`,
    update: (id) => `categories/${id}`,
    delete: (id) => `categories/${id}`,
  },

  // Client Endpoints
  clients: {
    getAll: "clients",
    create: "clients",
    update: (id) => `clients/${id}`,
    delete: (id) => `clients/${id}`,
  },

  // Inquiry Endpoints
  inquiries: {
    submit: "inquiries",
    getAll: "inquiries",
    filter: "inquiries/filter", // Note: Query params should be added by the API client
    getById: (id) => `inquiries/${id}`,
    markAsHandled: (id) => `inquiries/${id}/handle`,
  },

  // Service Endpoints
  services: {
    getAll: "services",
    create: "services",
    getById: (id) => `services/${id}`,
    update: (id) => `services/${id}`,
    delete: (id) => `services/${id}`,
  },

  // Testimonial Endpoints
  testimonials: {
    getAll: "testimonials",
    create: "testimonials",
    update: (id) => `testimonials/${id}`,
    delete: (id) => `testimonials/${id}`,
  },
};

export default apiUris;