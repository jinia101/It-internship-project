import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServicesMenu } from "@/components/ui/sidebar";
import {
  Search,
  Filter,
  Star,
  Award,
  X,
  Globe,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";
import { apiClient } from "../types/api";
import type { SchemeService } from "../types/api";

export default function UserSchemeService() {
  const [search, setSearch] = useState("");
  const [schemeTypeFilter, setSchemeTypeFilter] = useState("all");
  const [modalScheme, setModalScheme] = useState<SchemeService | null>(null);
  const [apiSchemeServices, setApiSchemeServices] = useState<SchemeService[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const filteredApiSchemes = apiSchemeServices.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      !schemeTypeFilter ||
      schemeTypeFilter === "all" ||
      s.type === schemeTypeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    published: apiSchemeServices.length,
    active: 0,
    total: apiSchemeServices.length,
  };

  useEffect(() => {
    fetchApiSchemeServices();
  }, []);

  const fetchApiSchemeServices = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPublicSchemeServices();
      const activeServices = (response.schemeServices || []).filter(
        (service) =>
          service.status === "published" && service.isActive !== false,
      );
      setApiSchemeServices(activeServices);
    } catch (error) {
      console.error("Error fetching scheme services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ServicesMenu />
      <div className="flex-1">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Government Schemes
              </h1>
              <p className="text-gray-600 text-lg">
                Discover and explore government schemes and benefits programs
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Schemes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Available programs
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Published
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.published}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Active schemes</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Categories
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(apiSchemeServices.map((s) => s.type)).size || 0}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Scheme types</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search schemes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="md:w-64">
                <Select
                  value={schemeTypeFilter}
                  onValueChange={setSchemeTypeFilter}
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Central">Central Government</SelectItem>
                    <SelectItem value="State">State Government</SelectItem>
                    <SelectItem value="Social Welfare">
                      Social Welfare
                    </SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Employment">Employment</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schemes Grid */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">
                Loading scheme services...
              </div>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApiSchemes.map((scheme) => (
                <div
                  key={`api-${scheme.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
                  onClick={() => setModalScheme(scheme)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Star className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {scheme.name}
                        </h3>
                        {scheme.type && (
                          <p className="text-sm text-gray-500">{scheme.type}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {scheme.summary}
                  </p>

                  <div className="space-y-2 mb-4">
                    {scheme.type && (
                      <div className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        <span className="text-gray-600">{scheme.type}</span>
                      </div>
                    )}
                    {scheme.targetAudience &&
                      scheme.targetAudience.length > 0 && (
                        <div className="flex items-center text-sm">
                          <Users className="h-3 w-3 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            Target: {scheme.targetAudience.join(", ")}
                          </span>
                        </div>
                      )}
                    {scheme.applicationMode && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          {scheme.applicationMode}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Click to view details
                    </span>
                    <div className="p-1 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                      <Award className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}

              {/* No Services Message */}
              {filteredApiSchemes.length === 0 &&
                (search ||
                  (schemeTypeFilter && schemeTypeFilter !== "all")) && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">
                      No scheme services found matching the current filters
                      {search && ` "${search}"`}
                      {schemeTypeFilter &&
                        schemeTypeFilter !== "all" &&
                        ` (${schemeTypeFilter})`}
                      .
                    </p>
                  </div>
                )}

              {filteredApiSchemes.length === 0 &&
                !search &&
                (!schemeTypeFilter || schemeTypeFilter === "all") &&
                !loading && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">
                      No published scheme services available.
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* Modal for Scheme Details */}
          {modalScheme && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
                  <button
                    onClick={() => setModalScheme(null)}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Star className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{modalScheme.name}</h2>
                      <p className="text-blue-100">
                        {modalScheme.type || "Government Scheme"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  {/* Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {modalScheme.summary}
                    </p>
                  </div>

                  {/* Key Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {modalScheme.type && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2 text-blue-600" />
                          Scheme Type
                        </h4>
                        <p className="text-gray-600">{modalScheme.type}</p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-green-600" />
                        Application Mode
                      </h4>
                      <p className="text-gray-600">
                        {modalScheme.applicationMode === "both"
                          ? "Online & Offline Available"
                          : modalScheme.applicationMode === "online"
                          ? "Online Only"
                          : "Offline Only"}
                      </p>
                    </div>

                    {modalScheme.targetAudience &&
                      modalScheme.targetAudience.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                            <Users className="h-4 w-4 mr-2 text-purple-600" />
                            Target Audience
                          </h4>
                          <p className="text-gray-600">
                            {modalScheme.targetAudience.join(", ")}
                          </p>
                        </div>
                      )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                        Status
                      </h4>
                      <p className="text-gray-600 capitalize">
                        {modalScheme.status}
                      </p>
                    </div>

                    {modalScheme.onlineUrl && (
                      <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-green-600" />
                          Online Application
                        </h4>
                        <a
                          href={modalScheme.onlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors break-all"
                        >
                          {modalScheme.onlineUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Detailed Information Sections */}
                  {modalScheme.eligibilityDetails &&
                    modalScheme.eligibilityDetails.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-purple-600" />
                          Eligibility Criteria
                        </h3>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {modalScheme.eligibilityDetails.map(
                              (item: any, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start space-x-2"
                                >
                                  <span className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2"></span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {modalScheme.schemeDetails &&
                    modalScheme.schemeDetails.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Award className="h-5 w-5 mr-2 text-blue-600" />
                          Scheme Details
                        </h3>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {modalScheme.schemeDetails.map(
                              (item: any, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start space-x-2"
                                >
                                  <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {modalScheme.processDetails &&
                    modalScheme.processDetails.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-green-600" />
                          Application Process
                        </h3>
                        <div className="bg-green-50 rounded-lg p-4">
                          <ul className="space-y-2">
                            {modalScheme.processDetails.map(
                              (item: any, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start space-x-2"
                                >
                                  <span className="flex-shrink-0 w-2 h-2 bg-green-600 rounded-full mt-2"></span>
                                  <span className="text-gray-700">{item}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      </div>
                    )}

                  {/* Contact Information */}
                  {modalScheme.contacts && modalScheme.contacts.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modalScheme.contacts.map((contact, idx) => (
                          <div
                            key={idx}
                            className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400"
                          >
                            <h4 className="font-medium text-gray-900">
                              {contact.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {contact.designation}
                            </p>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>{contact.serviceName}</p>
                              <p>
                                {contact.district}, {contact.subDistrict},{" "}
                                {contact.block}
                              </p>
                              <p>📞 {contact.contact}</p>
                              <p>✉️ {contact.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(modalScheme.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Updated:</span>{" "}
                        {new Date(modalScheme.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
