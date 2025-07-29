import { useState, useEffect } from "react";
import { getServices } from "../lib/localStorageUtils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServicesMenu } from "@/components/ui/sidebar";

export default function UserContactService() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [modalService, setModalService] = useState(null);

  useEffect(() => {
    setServices(getServices());
  }, []);

  // Only show published contact services
  const isContactService = (s) => !s.category || s.category === "Contact";
  const publishedServices = services.filter(
    (s) => s.status === "published" && isContactService(s),
  );
  const filteredServices = publishedServices.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    published: publishedServices.length,
    active: 0,
    total: publishedServices.length,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dummy Department Cards */}
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>Police Department</CardTitle>
                <CardDescription>Handles law enforcement and public safety.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Type: Emergency</p>
                <Button
                  onClick={() => setModalService({
                    name: "Police Department",
                    summary: "Handles law enforcement and public safety.",
                    type: "Emergency",
                    offices: [
                      { officeName: "Main Police Station", level: "Headquarters", district: "Central", pincode: "123456", address: "123 Main St" },
                      { officeName: "North Sector Police Post", level: "Sector", district: "North", pincode: "654321", address: "456 Oak Ave" }
                    ],
                    posts: [
                      { postName: "Station House Officer", postRank: "Inspector", officeIndex: 0 },
                      { postName: "Beat Constable", postRank: "Constable", officeIndex: 1 }
                    ],
                    employees: [
                      { employeeName: "John Doe", email: "john.doe@police.com", phone: "9876543210", designation: "Inspector", postIndex: 0 },
                      { employeeName: "Jane Smith", email: "jane.smith@police.com", phone: "0123456789", designation: "Constable", postIndex: 1 }
                    ]
                  })}
                  className="w-full mt-2 bg-blue-600 text-white"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>Fire Department</CardTitle>
                <CardDescription>Responds to fire incidents and provides rescue services.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Type: Emergency</p>
                <Button
                  onClick={() => setModalService({
                    name: "Fire Department",
                    summary: "Responds to fire incidents and provides rescue services.",
                    type: "Emergency",
                    offices: [
                      { officeName: "Central Fire Station", level: "Main", district: "Central", pincode: "112233", address: "789 Pine Ln" },
                      { officeName: "South Fire Sub-Station", level: "Sub-Station", district: "South", pincode: "332211", address: "101 Elm Rd" }
                    ],
                    posts: [
                      { postName: "Fire Chief", postRank: "Chief", officeIndex: 0 },
                      { postName: "Firefighter", postRank: "Firefighter", officeIndex: 1 }
                    ],
                    employees: [
                      { employeeName: "Peter Jones", email: "peter.jones@fire.com", phone: "1122334455", designation: "Fire Chief", postIndex: 0 },
                      { employeeName: "Mary Brown", email: "mary.brown@fire.com", phone: "5544332211", designation: "Firefighter", postIndex: 1 }
                    ]
                  })}
                  className="w-full mt-2 bg-blue-600 text-white"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <CardTitle>Public Works Department</CardTitle>
                <CardDescription>Manages infrastructure and public utilities.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Type: Regular</p>
                <Button
                  onClick={() => setModalService({
                    name: "Public Works Department",
                    summary: "Manages infrastructure and public utilities.",
                    type: "Regular",
                    offices: [
                      { officeName: "PWD Headquarters", level: "Main", district: "City", pincode: "998877", address: "222 Bridge St" },
                      { officeName: "Road Maintenance Office", level: "Field", district: "East", pincode: "778899", address: "333 Pothole Rd" }
                    ],
                    posts: [
                      { postName: "Executive Engineer", postRank: "Engineer", officeIndex: 0 },
                      { postName: "Road Supervisor", postRank: "Supervisor", officeIndex: 1 }
                    ],
                    employees: [
                      { employeeName: "David Green", email: "david.green@pwd.com", phone: "6677889900", designation: "Executive Engineer", postIndex: 0 },
                      { employeeName: "Sarah White", email: "sarah.white@pwd.com", phone: "0099887766", designation: "Road Supervisor", postIndex: 1 }
                    ]
                  })}
                  className="w-full mt-2 bg-blue-600 text-white"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
            {/* Existing Contact Service Cards */}
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setModalService(service)}
                    className="w-full mt-2 bg-blue-600 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
            
          </div>
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
                {modalService.offices && (
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">Department Structure</h3>
                    {modalService.offices.map((office, officeIdx) => (
                      <div key={officeIdx} className="mb-4 p-3 border rounded-md bg-gray-50">
                        <h4 className="font-semibold text-lg mb-1">Office: {office.officeName}</h4>
                        <p className="text-sm text-gray-600">
                          Level: {office.level}, District: {office.district}, Pincode: {office.pincode}, Address: {office.address}
                        </p>

                        {/* Posts within this office */}
                        {modalService.posts && modalService.posts.filter(post => post.officeIndex === officeIdx).length > 0 && (
                          <div className="mt-3">
                            <h5 className="font-semibold text-md mb-1">Posts:</h5>
                            <ul className="list-disc pl-6">
                              {modalService.posts.filter(post => post.officeIndex === officeIdx).map((post, postIdx) => (
                                <li key={postIdx} className="mb-2">
                                  <span className="font-medium">{post.postName}</span> ({post.postRank})
                                  {/* Employees within this post */}
                                  {modalService.employees && modalService.employees.filter(emp => emp.postIndex === modalService.posts.indexOf(post)).length > 0 && (
                                    <div className="ml-4 mt-1">
                                      <h6 className="font-semibold text-sm mb-1">Employees:</h6>
                                      <ul className="list-disc pl-4">
                                        {modalService.employees.filter(emp => emp.postIndex === modalService.posts.indexOf(post)).map((emp, empIdx) => (
                                          <li key={empIdx}>
                                            {emp.employeeName} ({emp.designation})
                                            {emp.email && `, Email: ${emp.email}`}
                                            {emp.phone && `, Phone: ${emp.phone}`}
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
