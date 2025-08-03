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
import { apiClient } from "../../shared/api";
import type { ContactService } from "../../shared/api";

export default function UserContactService() {
  const [services, setServices] = useState([]);
  const [apiContactServices, setApiContactServices] = useState<
    ContactService[]
  >([]);
  const [search, setSearch] = useState("");
  const [modalService, setModalService] = useState(null);
  const [filterType, setFilterType] = useState("State"); // 'State' or 'District'
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [officeDetails, setOfficeDetails] = useState({});

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

  const fetchOfficeDetails = async (serviceName) => {
    try {
      // Fetch office details for the service
      const officeResponse = await apiClient.getOfficeByName(serviceName);
      if (officeResponse.success && officeResponse.office) {
        const office = officeResponse.office;

        // Fetch posts for this office (assuming office has an ID)
        let posts = [];
        let employees = [];
        try {
          const postsResponse = await apiClient.getOfficePosts(office.id || 1);
          if (postsResponse.success) {
            posts = postsResponse.posts || [];
            // Extract employees from posts
            employees = posts.flatMap((post) => post.employees || []);
          }
        } catch (error) {
          console.log("Posts not found for office:", error);
        }

        console.log("Office data from API:", office);
        console.log("office.designation:", office.designation);
        console.log("office.district:", office.district);

        return {
          offices: [
            {
              officeName: office.serviceName,
              level: office.designation, // Use the designation field which stores the actual level
              district: office.district,
              subDistrict: office.subDistrict,
              block: office.block,
              pincode: "799001", // Default
              address: `${office.subDistrict}, ${office.block}, ${office.district}`,
              contact: office.contact,
              email: office.email,
              designation: office.designation,
              name: office.name,
            },
          ],
          posts: posts.map((post, index) => ({
            postName: post.postName,
            postRank: post.rank,
            officeIndex: 0,
            description: post.description,
            department: post.department,
            status: post.status,
          })),
          employees: employees.map((employee, index) => ({
            employeeName: employee.name,
            email: employee.email,
            phone: employee.phone,
            designation: employee.designation,
            employeeId: employee.employeeId,
            salary: employee.salary,
            status: employee.status,
            postIndex: 0, // You might need to map this properly
          })),
        };
      }
    } catch (error) {
      console.error("Error fetching office details:", error);
    }

    // Fallback to contact data if office details not found
    return null;
  };

  useEffect(() => {
    fetchApiContactServices();
  }, []);

  const fetchApiContactServices = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getContactServices();
      const publishedServices = (response.contactServices || []).filter(
        (service) => service.status === "published",
      );
      setApiContactServices(publishedServices);
    } catch (error) {
      console.error("Error fetching contact services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter services from API
  const filteredApiServices = apiContactServices.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    published: apiContactServices.length,
    active: 0,
    total: apiContactServices.length,
  };

  return (
    <div className="flex min-h-screen">
      <ServicesMenu />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Contact Service</h1>
          <p className="text-gray-600 mb-8">
            Find contact information for service officers.
          </p>
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Contact Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.published}
                </div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Contact Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.active}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in use
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Contact Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>
          </div>
          {/* Search Bar */}
          <div className="mb-8 flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search contact services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2"
            />
          </div>
          {/* Cards Grid */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-lg">Loading contact services...</div>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dummy Department Cards */}
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Police Department</CardTitle>
                  <CardDescription>
                    Handles law enforcement and public safety.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Type: Emergency
                  </p>
                  <Button
                    onClick={() =>
                      setModalService({
                        name: "Police Department",
                        summary: "Handles law enforcement and public safety.",
                        type: "Emergency",
                        offices: [
                          {
                            officeName: "State Police Headquarters",
                            level: "State",
                            district: "West Tripura",
                            pincode: "799001",
                            address: "Police Line, Agartala",
                          },
                          {
                            officeName: "West Tripura District Police Office",
                            level: "District",
                            district: "West Tripura",
                            pincode: "799001",
                            address: "Kunjaban, Agartala",
                          },
                          {
                            officeName: "Sepahijala District Police Office",
                            level: "District",
                            district: "Sepahijala",
                            pincode: "799101",
                            address: "Bishramganj, Sepahijala",
                          },
                          {
                            officeName: "Dhalai District Police Office",
                            level: "District",
                            district: "Dhalai",
                            pincode: "799201",
                            address: "Ambassa, Dhalai",
                          },
                        ],
                        posts: [
                          {
                            postName: "Director General of Police",
                            postRank: "DGP",
                            officeIndex: 0,
                          },
                          {
                            postName: "Superintendent of Police (West Tripura)",
                            postRank: "SP",
                            officeIndex: 1,
                          },
                          {
                            postName: "Superintendent of Police (Sepahijala)",
                            postRank: "SP",
                            officeIndex: 2,
                          },
                          {
                            postName: "Superintendent of Police (Dhalai)",
                            postRank: "SP",
                            officeIndex: 3,
                          },
                          {
                            postName: "Station House Officer",
                            postRank: "Inspector",
                            officeIndex: 1,
                          },
                        ],
                        employees: [
                          {
                            employeeName: "John Doe",
                            email: "john.doe@police.com",
                            phone: "9876543210",
                            designation: "DGP",
                            postIndex: 0,
                          },
                          {
                            employeeName: "Jane Smith",
                            email: "jane.smith@police.com",
                            phone: "0123456789",
                            designation: "SP",
                            postIndex: 1,
                          },
                          {
                            employeeName: "Peter Jones",
                            email: "peter.jones@police.com",
                            phone: "1122334455",
                            designation: "Inspector",
                            postIndex: 4,
                          },
                        ],
                      })
                    }
                    className="w-full mt-2 bg-blue-600 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Fire Department</CardTitle>
                  <CardDescription>
                    Responds to fire incidents and provides rescue services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Type: Emergency
                  </p>
                  <Button
                    onClick={() =>
                      setModalService({
                        name: "Fire Department",
                        summary:
                          "Responds to fire incidents and provides rescue services.",
                        type: "Emergency",
                        offices: [
                          {
                            officeName: "State Fire & Emergency Services HQ",
                            level: "State",
                            district: "West Tripura",
                            pincode: "799001",
                            address: "Fire Service Chowmuhani, Agartala",
                          },
                          {
                            officeName: "West Tripura District Fire Station",
                            level: "District",
                            district: "West Tripura",
                            pincode: "799001",
                            address: "Battala, Agartala",
                          },
                          {
                            officeName: "Gomati District Fire Station",
                            level: "District",
                            district: "Gomati",
                            pincode: "799110",
                            address: "Udaipur, Gomati",
                          },
                        ],
                        posts: [
                          {
                            postName: "Director, Fire & Emergency Services",
                            postRank: "Director",
                            officeIndex: 0,
                          },
                          {
                            postName: "Divisional Fire Officer (West)",
                            postRank: "DFO",
                            officeIndex: 1,
                          },
                          {
                            postName: "Station Officer (Gomati)",
                            postRank: "SO",
                            officeIndex: 2,
                          },
                        ],
                        employees: [
                          {
                            employeeName: "Peter Jones",
                            email: "peter.jones@fire.com",
                            phone: "1122334455",
                            designation: "Director",
                            postIndex: 0,
                          },
                          {
                            employeeName: "Mary Brown",
                            email: "mary.brown@fire.com",
                            phone: "5544332211",
                            designation: "DFO",
                            postIndex: 1,
                          },
                        ],
                      })
                    }
                    className="w-full mt-2 bg-blue-600 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle>Public Works Department</CardTitle>
                  <CardDescription>
                    Manages infrastructure and public utilities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Type: Regular
                  </p>
                  <Button
                    onClick={() =>
                      setModalService({
                        name: "Public Works Department",
                        summary: "Manages infrastructure and public utilities.",
                        type: "Regular",
                        offices: [
                          {
                            officeName: "PWD Headquarters, Agartala",
                            level: "State",
                            district: "West Tripura",
                            pincode: "799001",
                            address: "Secretariat, Agartala",
                          },
                          {
                            officeName: "PWD North Tripura Division",
                            level: "District",
                            district: "North Tripura",
                            pincode: "799250",
                            address: "Dharmanagar, North Tripura",
                          },
                          {
                            officeName: "PWD Unakoti Division",
                            level: "District",
                            district: "Unakoti",
                            pincode: "799260",
                            address: "Kailashahar, Unakoti",
                          },
                        ],
                        posts: [
                          {
                            postName: "Engineer-in-Chief",
                            postRank: "EiC",
                            officeIndex: 0,
                          },
                          {
                            postName: "Superintending Engineer (North)",
                            postRank: "SE",
                            officeIndex: 1,
                          },
                          {
                            postName: "Executive Engineer (Unakoti)",
                            postRank: "EE",
                            officeIndex: 2,
                          },
                        ],
                        employees: [
                          {
                            employeeName: "David Green",
                            email: "david.green@pwd.com",
                            phone: "6677889900",
                            designation: "EiC",
                            postIndex: 0,
                          },
                          {
                            employeeName: "Sarah White",
                            email: "sarah.white@pwd.com",
                            phone: "0099887766",
                            designation: "SE",
                            postIndex: 1,
                          },
                        ],
                      })
                    }
                    className="w-full mt-2 bg-blue-600 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
              {/* API Contact Service Cards */}
              {filteredApiServices.map((service) => (
                <Card
                  key={`api-${service.id}`}
                  className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Type: {service.type || "Regular"}
                    </p>
                    <Button
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const officeData = await fetchOfficeDetails(
                            service.name,
                          );

                          if (officeData) {
                            setModalService({
                              ...service,
                              ...officeData,
                            });
                          } else {
                            // Fallback to contact data if office details not found
                            setModalService({
                              ...service,
                              offices:
                                service.contacts?.map((contact, index) => ({
                                  officeName: `${contact.serviceName} Office - ${contact.district}`,
                                  level:
                                    contact.district === "West Tripura"
                                      ? "State"
                                      : "District",
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
                              posts:
                                service.contacts?.map((contact, index) => ({
                                  postName: contact.designation,
                                  postRank: contact.designation,
                                  officeIndex: index,
                                })) || [],
                              employees:
                                service.contacts?.map((contact, index) => ({
                                  employeeName: contact.name,
                                  email: contact.email,
                                  phone: contact.contact,
                                  designation: contact.designation,
                                  postIndex: index,
                                })) || [],
                            });
                          }
                        } catch (error) {
                          console.error("Error loading office details:", error);
                          // Fallback to basic service data
                          setModalService(service);
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="w-full mt-2 bg-blue-600 text-white"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "View Details"}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* No Services Message */}
              {filteredApiServices.length === 0 && search && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">
                    No contact services found matching "{search}".
                  </p>
                </div>
              )}

              {filteredApiServices.length === 0 && !search && !loading && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">
                    No published contact services available.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Modal for Contact Service Details */}
          {modalService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-fade-in overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setModalService(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{modalService.name}</h2>
                <p className="mb-2 text-gray-700">{modalService.summary}</p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Type</h3>
                  <p>{modalService.type}</p>
                </div>

                {/* Filter Dropdowns */}
                {modalService.offices && (
                  <div className="mb-4 flex gap-4">
                    <Select
                      onValueChange={(value) => {
                        setFilterType(value);
                        setSelectedDistrict(""); // Reset district when filter type changes
                      }}
                      value={filterType}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Filter Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="State">State Level</SelectItem>
                        <SelectItem value="District">District Level</SelectItem>
                      </SelectContent>
                    </Select>

                    {filterType === "District" && (
                      <Select
                        onValueChange={(value) => setSelectedDistrict(value)}
                        value={selectedDistrict}
                      >
                        <SelectTrigger className="w-[180px]">
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
                )}

                {modalService.offices && (
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">
                      Department Structure
                    </h3>
                    {modalService.offices
                      .filter((office) => {
                        if (filterType === "State") {
                          return office.level === "State";
                        } else if (
                          filterType === "District" &&
                          selectedDistrict
                        ) {
                          // Show any office in the selected district, regardless of level
                          return office.district === selectedDistrict;
                        }
                        return true; // Show all if no filter or initial state
                      })
                      .map((office, officeIdx) => (
                        <div
                          key={officeIdx}
                          className="mb-4 p-3 border rounded-md bg-gray-50"
                        >
                          <h4 className="font-semibold text-lg mb-1">
                            Office: {office.officeName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Level: {office.level}, District: {office.district},
                            Pincode: {office.pincode}, Address: {office.address}
                          </p>

                          {/* Posts within this office */}
                          {modalService.posts &&
                            modalService.posts.filter(
                              (post) =>
                                post.officeIndex ===
                                modalService.offices.indexOf(office),
                            ).length > 0 && (
                              <div className="mt-3">
                                <h5 className="font-semibold text-md mb-1">
                                  Posts:
                                </h5>
                                <ul className="list-disc pl-6">
                                  {modalService.posts
                                    .filter(
                                      (post) =>
                                        post.officeIndex ===
                                        modalService.offices.indexOf(office),
                                    )
                                    .map((post, postIdx) => (
                                      <li key={postIdx} className="mb-2">
                                        <span className="font-medium">
                                          {post.postName}
                                        </span>{" "}
                                        ({post.postRank})
                                        {/* Employees within this post */}
                                        {modalService.employees &&
                                          modalService.employees.filter(
                                            (emp) =>
                                              emp.postIndex ===
                                              modalService.posts.indexOf(post),
                                          ).length > 0 && (
                                            <div className="ml-4 mt-1">
                                              <h6 className="font-semibold text-sm mb-1">
                                                Employees:
                                              </h6>
                                              <ul className="list-disc pl-4">
                                                {modalService.employees
                                                  .filter(
                                                    (emp) =>
                                                      emp.postIndex ===
                                                      modalService.posts.indexOf(
                                                        post,
                                                      ),
                                                  )
                                                  .map((emp, empIdx) => (
                                                    <li key={empIdx}>
                                                      {emp.employeeName} (
                                                      {emp.designation})
                                                      {emp.email &&
                                                        `, Email: ${emp.email}`}
                                                      {emp.phone &&
                                                        `, Phone: ${emp.phone}`}
                                                    </li>
                                                  ))}
                                              </ul>
                                            </div>
                                          )}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      ))}
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Status</h3>
                  <p>{modalService.status}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
