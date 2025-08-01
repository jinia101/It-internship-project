// API Types and Interfaces

export interface Admin {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface ContactPerson {
  id?: number;
  serviceName: string;
  district: string;
  subDistrict: string;
  block: string;
  name: string;
  designation: string;
  contact: string;
  email: string;
}

export interface SupportiveDocument {
  id?: number;
  slNo: number;
  documentType: string;
  validProof: string;
  isRequired: boolean;
}

export interface SchemeService {
  id: number;
  name: string;
  summary: string;
  type?: string;
  targetAudience: string[];
  applicationMode: "online" | "offline" | "both";
  onlineUrl?: string;
  offlineAddress?: string;
  status: "draft" | "pending" | "published";
  createdAt: string;
  updatedAt: string;

  // Extended details
  eligibilityDetails: string[];
  schemeDetails: string[];
  processDetails: string[];

  // Process flows
  processNew?: string;
  processUpdate?: string;
  processLost?: string;
  processSurrender?: string;

  // Document requirements
  docNew?: string;
  docUpdate?: string;
  docLost?: string;
  docSurrender?: string;

  // Relations
  admin?: Admin;
  adminId: number;
  contacts: ContactPerson[];
  documents: SupportiveDocument[];
}

// API Response Types
export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  errors?: Array<{ msg: string; param: string; value: any }>;
  data?: T;
}

export interface AuthResponse extends ApiResponse {
  admin?: Admin;
  token?: string;
}

export interface SchemeServiceResponse extends ApiResponse {
  schemeService?: SchemeService;
}

export interface SchemeServicesListResponse extends ApiResponse {
  schemeServices?: SchemeService[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats?: {
    draft: number;
    pending: number;
    published: number;
    total: number;
  };
}

// API Request Types
export interface CreateSchemeServiceRequest {
  name: string;
  summary: string;
  type?: string;
  targetAudience: string[];
  applicationMode: "online" | "offline" | "both";
  onlineUrl?: string;
  offlineAddress?: string;
}

export interface UpdateSchemeServiceRequest {
  eligibilityDetails?: string[];
  schemeDetails?: string[];
  processDetails?: string[];
  processNew?: string;
  processUpdate?: string;
  processLost?: string;
  processSurrender?: string;
  docNew?: string;
  docUpdate?: string;
  docLost?: string;
  docSurrender?: string;
  contacts?: ContactPerson[];
  documents?: SupportiveDocument[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// API Client Configuration
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-api.com/api"
    : "http://localhost:3001/api";

// API Client Class
export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("admin_token");
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("admin_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("admin_token");
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    console.log("API Request:", {
      url,
      method: options.method || "GET",
      hasToken: !!this.token,
      headers,
      body: options.body,
    });

    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log("API Response:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);

      // Handle validation errors specifically
      if (response.status === 400 && errorData.errors) {
        const validationMessages = errorData.errors
          .map((err: any) => err.msg)
          .join(", ");
        throw new Error(`Validation failed: ${validationMessages}`);
      }

      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json();
  }

  // Auth methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>("/auth/profile");
  }

  // Scheme Service methods
  async createSchemeService(
    data: CreateSchemeServiceRequest,
  ): Promise<SchemeServiceResponse> {
    return this.makeRequest<SchemeServiceResponse>("/scheme-services/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getSchemeServices(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<SchemeServicesListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return this.makeRequest<SchemeServicesListResponse>(
      `/scheme-services${query ? `?${query}` : ""}`,
    );
  }

  async getSchemeService(id: number): Promise<SchemeServiceResponse> {
    return this.makeRequest<SchemeServiceResponse>(`/scheme-services/${id}`);
  }

  async updateSchemeService(
    id: number,
    data: UpdateSchemeServiceRequest,
  ): Promise<SchemeServiceResponse> {
    return this.makeRequest<SchemeServiceResponse>(`/scheme-services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async publishSchemeService(id: number): Promise<SchemeServiceResponse> {
    return this.makeRequest<SchemeServiceResponse>(
      `/scheme-services/${id}/publish`,
      {
        method: "PATCH",
      },
    );
  }

  async deleteSchemeService(id: number): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(`/scheme-services/${id}`, {
      method: "DELETE",
    });
  }

  // Public methods (no auth required)
  async getPublicSchemeServices(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SchemeServicesListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const query = queryParams.toString();
    return this.makeRequest<SchemeServicesListResponse>(
      `/scheme-services/public/list${query ? `?${query}` : ""}`,
    );
  }

  async getPublicSchemeService(id: number): Promise<SchemeServiceResponse> {
    return this.makeRequest<SchemeServiceResponse>(
      `/scheme-services/public/${id}`,
    );
  }
}

// Default API client instance
export const apiClient = new ApiClient();
