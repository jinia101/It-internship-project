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
                <Button className="w-full mt-2 bg-blue-600 text-white">
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
                <Button className="w-full mt-2 bg-blue-600 text-white">
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
                <Button className="w-full mt-2 bg-blue-600 text-white">
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
                    <h3 className="font-semibold mb-2">Offices</h3>
                    <ul className="list-disc pl-6">
                      {modalService.offices.map((office, idx) => (
                        <li key={idx}>
                          <span className="font-medium">
                            {office.officeName}
                          </span>
                          {office.address && `, ${office.address}`}
                          {office.district && `, ${office.district}`}
                          {office.block && `, ${office.block}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {modalService.posts && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Posts</h3>
                    <ul className="list-disc pl-6">
                      {modalService.posts.map((post, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{post.postName}</span>
                          {modalService.offices &&
                            modalService.offices[post.officeIndex] && (
                              <span>
                                {" "}
                                (Office:{" "}
                                {
                                  modalService.offices[post.officeIndex]
                                    .officeName
                                }
                                )
                              </span>
                            )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {modalService.employees && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Employees</h3>
                    <ul className="list-disc pl-6">
                      {modalService.employees.map((emp, idx) => (
                        <li key={idx}>
                          <span className="font-medium">
                            {emp.employeeName}
                          </span>
                          {modalService.posts &&
                            modalService.posts[emp.postIndex] && (
                              <span>
                                {" "}
                                (Post:{" "}
                                {modalService.posts[emp.postIndex].postName})
                              </span>
                            )}
                          {emp.email && <span>, Email: {emp.email}</span>}
                          {emp.phone && <span>, Phone: {emp.phone}</span>}
                        </li>
                      ))}
                    </ul>
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
