import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ServicesMenu } from "@/components/ui/sidebar";
import {
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Building2,
  X,
  Users,
} from "lucide-react";
import { apiClient } from "../types/api";
import type { ContactService } from "../types/api";

export default function UserContactService() {
  const [apiContactServices, setApiContactServices] = useState<
    ContactService[]
  >([]);
  const [search, setSearch] = useState("");
  const [modalService, setModalService] = useState<any>(null);
  const [filterType, setFilterType] = useState("State"); // 'State' or 'District'
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [departmentTypeFilter, setDepartmentTypeFilter] = useState("all"); // 'all', 'emergency', 'regular'
  const [loading, setLoading] = useState(false);

  const tripuraDistricts = [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura",
  ];

  const fetchOfficeDetails = async (service: any) => {
    try {
      // Instead of looking for an office by service name,
      // iterate through the service's contacts (offices) and get posts for each
      const allPosts = [];
      const allEmployees = [];
      const officeDetails = [];

      if (service.contacts && service.contacts.length > 0) {
        for (const contact of service.contacts) {
          try {
            // Get posts for this office using the contact's ID as officeId
            const postsResponse = await apiClient.getPublicOfficePosts(
              contact.id,
            );
            if (postsResponse.success && postsResponse.posts) {
              // Format posts to match expected structure
              const formattedPosts = postsResponse.posts.map((post) => ({
                postName: post.postName,
                postRank: post.rank,
                officeIndex: 0,
                description: post.description,
                department: post.department,
                status: post.status,
              }));
              allPosts.push(...formattedPosts);

              // Extract and format employees from posts
              const employees = postsResponse.posts.flatMap((post) =>
                (post.employees || []).map((employee) => ({
                  employeeName: employee.name,
                  email: employee.email,
                  phone: employee.phone,
                  designation: employee.designation,
                  employeeId: employee.employeeId,
                  salary: employee.salary,
                  status: employee.status,
                  postIndex: 0,
                })),
              );
              allEmployees.push(...employees);
            }

            // Add office details
            officeDetails.push({
              officeName: contact.name,
              level: contact.designation,
              district: contact.district,
              subDistrict: contact.subDistrict,
              block: contact.block,
              pincode: "799001", // Default pincode
              address: `${contact.subDistrict}, ${contact.block}, ${contact.district}`,
              contact: contact.contact,
              email: contact.email,
              designation: contact.designation,
              name: contact.name,
            });
          } catch (error) {
            console.error(
              `Error fetching posts for office ${contact.name}:`,
              error,
            );
            // Continue with other offices even if one fails
          }
        }
      }

      return {
        offices: officeDetails,
        posts: allPosts,
        employees: allEmployees,
      };
    } catch (error) {
      console.error("Error in fetchOfficeDetails:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchApiContactServices();
  }, []);

  const fetchApiContactServices = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getPublicContactServices();
      const activeServices = (response.contactServices || []).filter(
        (service) =>
          service.status === "published" && service.isActive !== false,
      );
      setApiContactServices(activeServices);
    } catch (error) {
      console.error("Error fetching contact services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter services from API
  const filteredApiServices = apiContactServices.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesDepartmentType =
      departmentTypeFilter === "all" ||
      s.applicationMode === departmentTypeFilter;
    return matchesSearch && matchesDepartmentType;
  });

  const stats = {
    published: apiContactServices.length,
    active: 0,
    total: apiContactServices.length,
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
                Contact Directory
              </h1>
              <p className="text-gray-600 text-lg">
                Connect with government service officers and departments
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
                    Total Services
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Available departments
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
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
                  <p className="text-xs text-green-600 mt-1">Active services</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Emergency
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {
                      apiContactServices.filter(
                        (s) => s.applicationMode === "emergency",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-red-600 mt-1">24/7 available</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <Phone className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search contact services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <Select
                  value={departmentTypeFilter}
                  onValueChange={setDepartmentTypeFilter}
                >
                  <SelectTrigger className="w-48 border-gray-300">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="emergency">
                      Emergency Services
                    </SelectItem>
                    <SelectItem value="regular">Regular Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* Services Grid */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading contact services...</p>
              </div>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApiServices.map((service) => (
                <div
                  key={`api-${service.id}`}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.applicationMode === "emergency"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {service.type || service.applicationMode || "Regular"}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Government</span>
                      </div>
                    </div>

                    <Button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const officeData = await fetchOfficeDetails(service);

                          if (officeData) {
                            setModalService({
                              ...service,
                              ...officeData,
                            });
                          } else {
                            setModalService({
                              ...service,
                              offices:
                                service.contacts?.map((contact) => ({
                                  officeName: contact.name,
                                  level: contact.designation,
                                  district: contact.district,
                                  subDistrict: contact.subDistrict,
                                  block: contact.block,
                                  pincode: "799001",
                                  address: `${contact.subDistrict}, ${contact.block}, ${contact.district}`,
                                  contact: contact.contact,
                                  email: contact.email,
                                  designation: contact.designation,
                                  name: contact.name,
                                })) || [],
                              posts: [],
                              employees: [],
                            });
                          }
                        } catch (error) {
                          console.error("Error loading office details:", error);
                          setModalService(service);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="w-full bg-gray-900 hover:bg-blue-600 text-white border-0 rounded-lg py-2.5 font-medium transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Loading...
                        </span>
                      ) : (
                        "View Contact Details"
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Empty States */}
              {filteredApiServices.length === 0 && search && (
                <div className="col-span-full">
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No services found
                    </h3>
                    <p className="text-gray-600">
                      No contact services found matching "{search}". Try
                      adjusting your search terms.
                    </p>
                  </div>
                </div>
              )}

              {filteredApiServices.length === 0 && !search && !loading && (
                <div className="col-span-full">
                  <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No services available
                    </h3>
                    <p className="text-gray-600">
                      No published contact services are currently available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modern Modal for Contact Service Details */}
          {modalService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">
                        {modalService.name}
                      </h2>
                      <p className="text-blue-100 leading-relaxed">
                        {modalService.summary}
                      </p>
                    </div>
                    <button
                      onClick={() => setModalService(null)}
                      className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="p-6">
                    {/* Service Type Badge */}
                    <div className="mb-6">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                          modalService.applicationMode === "emergency"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        {modalService.type ||
                          modalService.applicationMode ||
                          "Government Service"}
                      </span>
                    </div>

                    {/* Filter Controls */}
                    {modalService.offices &&
                      modalService.offices.length > 0 && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">
                            Filter Offices
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            <Select
                              onValueChange={(value) => {
                                setFilterType(value);
                                setSelectedDistrict("");
                              }}
                              value={filterType}
                            >
                              <SelectTrigger className="w-40 bg-white border-gray-300">
                                <SelectValue placeholder="Select Level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="State">
                                  State Level
                                </SelectItem>
                                <SelectItem value="District">
                                  District Level
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            {filterType === "District" && (
                              <Select
                                onValueChange={(value) =>
                                  setSelectedDistrict(value)
                                }
                                value={selectedDistrict}
                              >
                                <SelectTrigger className="w-48 bg-white border-gray-300">
                                  <SelectValue placeholder="Select District" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tripuraDistricts.map((district) => (
                                    <SelectItem key={district} value={district}>
                                      {district}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Department Structure */}
                    {modalService.offices &&
                      modalService.offices.length > 0 && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Department Structure
                          </h3>
                          <div className="space-y-4">
                            {modalService.offices
                              .filter((office: any) => {
                                if (filterType === "State") {
                                  return office.level === "State";
                                } else if (
                                  filterType === "District" &&
                                  selectedDistrict
                                ) {
                                  return office.district === selectedDistrict;
                                }
                                return true;
                              })
                              .map((office: any, officeIdx: number) => (
                                <div
                                  key={officeIdx}
                                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                                >
                                  {/* Office Header */}
                                  <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                        {office.officeName}
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center text-gray-600">
                                          <Building2 className="h-4 w-4 mr-2 text-blue-500" />
                                          <span>{office.level} Level</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                          <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                          <span>{office.district}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                          <Phone className="h-4 w-4 mr-2 text-green-500" />
                                          <span>{office.contact}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                          <Mail className="h-4 w-4 mr-2 text-purple-500" />
                                          <span className="truncate">
                                            {office.email}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Address */}
                                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                      <MapPin className="h-4 w-4 inline mr-1 text-red-500" />
                                      {office.address}, Pincode:{" "}
                                      {office.pincode}
                                    </p>
                                  </div>

                                  {/* Posts Section */}
                                  {modalService.posts &&
                                  modalService.posts.filter(
                                    (post: any) =>
                                      post.officeIndex ===
                                      modalService.offices.indexOf(office),
                                  ).length > 0 ? (
                                    <div className="space-y-3">
                                      <h5 className="font-semibold text-gray-900">
                                        Positions & Staff
                                      </h5>
                                      {modalService.posts
                                        .filter(
                                          (post: any) =>
                                            post.officeIndex ===
                                            modalService.offices.indexOf(
                                              office,
                                            ),
                                        )
                                        .map((post: any, postIdx: number) => (
                                          <div
                                            key={postIdx}
                                            className="bg-blue-50 rounded-lg p-4"
                                          >
                                            <div className="flex items-center justify-between mb-3">
                                              <span className="font-medium text-blue-900">
                                                {post.postName}
                                              </span>
                                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                                {post.postRank}
                                              </span>
                                            </div>

                                            {/* Employees */}
                                            {modalService.employees &&
                                            modalService.employees.filter(
                                              (emp: any) =>
                                                emp.postIndex ===
                                                modalService.posts.indexOf(
                                                  post,
                                                ),
                                            ).length > 0 ? (
                                              <div className="space-y-2">
                                                <h6 className="text-sm font-medium text-gray-700">
                                                  Staff Members:
                                                </h6>
                                                <div className="grid gap-2">
                                                  {modalService.employees
                                                    .filter(
                                                      (emp: any) =>
                                                        emp.postIndex ===
                                                        modalService.posts.indexOf(
                                                          post,
                                                        ),
                                                    )
                                                    .map(
                                                      (
                                                        emp: any,
                                                        empIdx: number,
                                                      ) => (
                                                        <div
                                                          key={empIdx}
                                                          className="bg-white rounded-lg p-3 border border-blue-200"
                                                        >
                                                          <div className="flex items-center justify-between">
                                                            <div>
                                                              <p className="font-medium text-gray-900">
                                                                {
                                                                  emp.employeeName
                                                                }
                                                              </p>
                                                              <p className="text-sm text-gray-600">
                                                                {
                                                                  emp.designation
                                                                }
                                                              </p>
                                                            </div>
                                                            <div className="text-right text-sm">
                                                              {emp.email && (
                                                                <p className="text-gray-600 flex items-center">
                                                                  <Mail className="h-3 w-3 mr-1" />
                                                                  {emp.email}
                                                                </p>
                                                              )}
                                                              {emp.phone && (
                                                                <p className="text-gray-600 flex items-center">
                                                                  <Phone className="h-3 w-3 mr-1" />
                                                                  {emp.phone}
                                                                </p>
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      ),
                                                    )}
                                                </div>
                                              </div>
                                            ) : (
                                              <p className="text-sm text-gray-500 italic">
                                                No staff details available
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                      <p className="text-sm text-gray-500 italic">
                                        No position details available
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Status */}
                    <div className="mt-6 p-4 bg-green-50 rounded-xl">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm font-medium text-green-800">
                          Status: {modalService.status}
                        </span>
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
