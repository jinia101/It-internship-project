import axios from "axios";

// API base URL - will point to our Spring Boot backend
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Service interface matching the original structure
export interface Service {
  id?: string;
  name: string;
  summary: string;
  applicationMode: string;
  category: string;
  eligibility: string;
  contactName?: string;
  designation?: string;
  contact?: string;
  email?: string;
  district?: string;
  subDistrict?: string;
  block?: string;
  serviceDetails?: string;
  status: "pending" | "published";
  processNew?: string;
  processUpdate?: string;
  processLost?: string;
  processSurrender?: string;
  docNew?: string;
  docUpdate?: string;
  docLost?: string;
  docSurrender?: string;
  applicationLocation?: string;
  tags: string[];
}

// API service functions - these will replace localStorage functions
export const apiService = {
  // Get all services
  getAllServices: async (): Promise<Service[]> => {
    const response = await api.get("/services");
    return response.data;
  },

  // Get service by ID
  getServiceById: async (id: string): Promise<Service> => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Create new service
  createService: async (service: Omit<Service, "id">): Promise<Service> => {
    const response = await api.post("/services", service);
    return response.data;
  },

  // Update service
  updateService: async (
    id: string,
    service: Partial<Service>,
  ): Promise<Service> => {
    const response = await api.put(`/services/${id}`, service);
    return response.data;
  },

  // Delete service
  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`);
  },

  // Get services by category
  getServicesByCategory: async (category: string): Promise<Service[]> => {
    const response = await api.get(`/services/category/${category}`);
    return response.data;
  },

  // Search services
  searchServices: async (query: string): Promise<Service[]> => {
    const response = await api.get(
      `/services/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  // Get published services only
  getPublishedServices: async (): Promise<Service[]> => {
    const response = await api.get("/services/published");
    return response.data;
  },

  // Get pending services only
  getPendingServices: async (): Promise<Service[]> => {
    const response = await api.get("/services/pending");
    return response.data;
  },
};

export default api;
