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
import { Search, FileText, Award, X, Globe, MapPin, Users } from "lucide-react";
import { apiClient } from "../types/api";
import type { CertificateService } from "../types/api";

// Extended type for modal with additional properties
interface ModalCertificateService
  extends Omit<CertificateService, "documents" | "processSteps"> {
  abbreviation?: string;
  processSteps?: any;
  documents?: any;
  eligibility?: any;
  contact?: any;
  processNew?: string;
  processUpdate?: string;
  processLost?: string;
  processSurrender?: string;
}

export default function UserCertificateService() {
  const [search, setSearch] = useState("");
  const [modalCert, setModalCert] = useState<ModalCertificateService | null>(
    null,
  );
  const [apiCertificateServices, setApiCertificateServices] = useState<
    CertificateService[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplicationType, setSelectedApplicationType] =
    useState("New Application");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCertificateServices({
        status: "published",
      });
      const activeServices = response.data.filter(
        (service: CertificateService) => service.isActive,
      );
      setApiCertificateServices(activeServices);
    } catch (error) {
      console.error("Error fetching certificate services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredServices = apiCertificateServices.filter(
    (service) =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.targetAudience.some((audience) =>
        audience.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  const openModal = (cert: CertificateService) => {
    const modalCert: ModalCertificateService = {
      ...cert,
      abbreviation: cert.name
        .split(" ")
        .map((word: string) => word[0])
        .join("")
        .toUpperCase(),
      eligibility: "Citizens of India",
      contact: {
        phone: "+91-1234567890",
        email: "certificates@gov.in",
        office: "District Collectorate",
      },
      processNew:
        "Submit application with required documents → Verification by department → Document processing → Certificate issued",
      processUpdate:
        "Submit request with existing certificate → Verification → Update processing → Updated certificate issued",
      processLost:
        "File FIR for lost certificate → Submit affidavit → Verification → Duplicate certificate issued",
      processSurrender:
        "Submit surrender application → Return original certificate → Verification → Surrender acknowledgment issued",
    };
    setModalCert(modalCert);
  };

  const closeModal = () => {
    setModalCert(null);
    setSelectedApplicationType("New Application");
  };

  const getProcessByType = (cert: ModalCertificateService) => {
    switch (selectedApplicationType) {
      case "New Application":
        return cert.processNew || "Standard new application process";
      case "Update/Renewal":
        return cert.processUpdate || "Standard update/renewal process";
      case "Lost Certificate":
        return cert.processLost || "Standard lost certificate process";
      case "Surrender":
        return cert.processSurrender || "Standard surrender process";
      default:
        return cert.processNew || "Standard process";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ServicesMenu />
      <div className="flex-1 p-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Certificate Services
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Government certification services and documents
              </p>
            </div>
          </div>

          {/* Professional Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Services
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {filteredServices.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Services
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {filteredServices.length}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Departments
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {
                      [
                        ...new Set(
                          filteredServices.map((s) =>
                            s.targetAudience.join(", "),
                          ),
                        ),
                      ].length
                    }
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search certificate services or departments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => openModal(service)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg group-hover:shadow-lg transition-shadow">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {service.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Users className="w-4 h-4 mr-1" />
                  {service.targetAudience.join(", ")}
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {service.summary}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-600">
                    View Details
                  </span>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 text-sm">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredServices.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Beautiful Modern Modal */}
        {modalCert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Beautiful Gradient Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{modalCert.name}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {modalCert.targetAudience.join(", ")}
                      </span>
                      <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                        {modalCert.abbreviation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Application Type Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Application Type
                  </label>
                  <Select
                    value={selectedApplicationType}
                    onValueChange={setSelectedApplicationType}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Application">
                        New Application
                      </SelectItem>
                      <SelectItem value="Update/Renewal">
                        Update/Renewal
                      </SelectItem>
                      <SelectItem value="Lost Certificate">
                        Lost Certificate
                      </SelectItem>
                      <SelectItem value="Surrender">Surrender</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Service Description
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {modalCert.summary}
                      </p>
                    </div>

                    {/* Eligibility */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Eligibility Criteria
                      </h3>
                      <p className="text-gray-600">{modalCert.eligibility}</p>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-green-600" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-600">
                            {modalCert.contact?.office}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <span className="w-4 h-4 text-green-600 text-sm">
                              📞
                            </span>
                          </div>
                          <span className="text-gray-600">
                            {modalCert.contact?.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <span className="w-4 h-4 text-green-600 text-sm">
                              ✉️
                            </span>
                          </div>
                          <span className="text-gray-600">
                            {modalCert.contact?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Application Process */}
                    <div className="bg-purple-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-600" />
                        Application Process ({selectedApplicationType})
                      </h3>
                      <div className="space-y-3">
                        {getProcessByType(modalCert)
                          .split(" → ")
                          .map((step, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-purple-600 text-sm font-medium">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-gray-600">
                                {step.trim()}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="bg-orange-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Service Features
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600">
                            Online application available
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600">
                            Digital certificate issued
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600">
                            Status tracking available
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-600">
                            Valid across India
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
