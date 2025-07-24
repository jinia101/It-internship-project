import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServicesMenu } from "@/components/ui/sidebar";
import { getServices } from "../lib/localStorageUtils";

export default function UserCertificateService() {
  const [search, setSearch] = useState("");
  const [modalCert, setModalCert] = useState(null);
  const publishedCerts = getServices().filter(
    (s) => s.status === "published" && s.category === "Certificate",
  );
  const filteredCerts = publishedCerts.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );
  const stats = {
    published: publishedCerts.length,
    active: 0,
    total: publishedCerts.length,
  };

  return (
    <div className="flex min-h-screen">
      <ServicesMenu />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Certificates</h1>
          <p className="text-gray-600 mb-8">
            Browse available certificates and view details.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Certificates
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
                  Active Certificates
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
                  Total Certificates
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
          <div className="mb-8 flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search certificates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <Card
                key={cert.id}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle>{cert.name}</CardTitle>
                  <CardDescription>{cert.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setModalCert(cert)}
                    className="w-full mt-2 bg-blue-600 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
            {filteredCerts.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No certificates found.
              </div>
            )}
          </div>
          {/* Modal for Certificate Details */}
          {modalCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-fade-in overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setModalCert(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{modalCert.name}</h2>
                <p className="mb-2 text-gray-700">{modalCert.summary}</p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Process Steps</h3>
                  <ul className="list-disc pl-6">
                    {modalCert.processSteps &&
                      modalCert.processSteps.map((step, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{step.slNo}.</span>{" "}
                          {step.stepDetails}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Supportive Documents</h3>
                  <ul className="list-disc pl-6">
                    {modalCert.documents &&
                      modalCert.documents.map((doc, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{doc.slNo}.</span>{" "}
                          {doc.documentType} (Valid Proof: {doc.validProof})
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Contact Person</h3>
                  {modalCert.contact && (
                    <ul className="list-disc pl-6">
                      <li>
                        <span className="font-medium">Service Name:</span>{" "}
                        {modalCert.contact.serviceName}
                      </li>
                      <li>
                        <span className="font-medium">District:</span>{" "}
                        {modalCert.contact.district}
                      </li>
                      <li>
                        <span className="font-medium">Sub District:</span>{" "}
                        {modalCert.contact.subDistrict}
                      </li>
                      <li>
                        <span className="font-medium">Block:</span>{" "}
                        {modalCert.contact.block}
                      </li>
                      <li>
                        <span className="font-medium">Name:</span>{" "}
                        {modalCert.contact.name}
                      </li>
                      <li>
                        <span className="font-medium">Designation:</span>{" "}
                        {modalCert.contact.designation}
                      </li>
                      <li>
                        <span className="font-medium">Contact:</span>{" "}
                        {modalCert.contact.contact}
                      </li>
                      <li>
                        <span className="font-medium">Email:</span>{" "}
                        {modalCert.contact.email}
                      </li>
                    </ul>
                  )}
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Service Details</h3>
                  <p>{modalCert.serviceDetails}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Status</h3>
                  <p>{modalCert.status}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Process Info</h3>
                  <ul className="list-disc pl-6">
                    <li>
                      <span className="font-medium">New:</span>{" "}
                      {modalCert.processNew}
                    </li>
                    <li>
                      <span className="font-medium">Update:</span>{" "}
                      {modalCert.processUpdate}
                    </li>
                    <li>
                      <span className="font-medium">Lost:</span>{" "}
                      {modalCert.processLost}
                    </li>
                    <li>
                      <span className="font-medium">Surrender:</span>{" "}
                      {modalCert.processSurrender}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
