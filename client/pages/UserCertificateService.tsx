import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServicesMenu } from "@/components/ui/sidebar";
import { apiClient } from "../../shared/api";
import type { CertificateService } from "../../shared/api";

export default function UserCertificateService() {
  const [search, setSearch] = useState("");
  const [modalCert, setModalCert] = useState(null);
  const [selectedApplicationType, setSelectedApplicationType] =
    useState("New Application");
  const [apiCertificateServices, setApiCertificateServices] = useState<
    CertificateService[]
  >([]);
  const [loading, setLoading] = useState(false);

  const filteredApiCerts = apiCertificateServices.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    published: apiCertificateServices.length,
    active: 0,
    total: apiCertificateServices.length,
  };

  useEffect(() => {
    fetchApiCertificateServices();
  }, []);

  const fetchApiCertificateServices = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCertificateServices();
      const publishedServices = (response.certificateServices || []).filter(
        (service) => service.status === "published",
      );
      setApiCertificateServices(publishedServices);
    } catch (error) {
      console.error("Error fetching certificate services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset application type when modal certificate changes
  useEffect(() => {
    if (modalCert) {
      setSelectedApplicationType("New Application");
    }
  }, [modalCert]);

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
          {/* Cards Grid */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-lg">Loading certificate services...</div>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Dummy certificate cards */}
              {[
                {
                  id: "dummy-aadhaar",
                  name: "Aadhaar Card",
                  abbreviation: "UIDAI",
                  summary: "Unique Identification for Indian Residents.",
                  applicationMode: "Online/Offline",
                  status: "published",
                  processSteps: {
                    "New Application": [
                      {
                        slNo: "1",
                        stepDetails: "Visit nearest Aadhaar enrollment center",
                      },
                      {
                        slNo: "2",
                        stepDetails: "Provide biometric and demographic data",
                      },
                      {
                        slNo: "3",
                        stepDetails: "Receive enrollment slip with URN number",
                      },
                      {
                        slNo: "4",
                        stepDetails: "Download Aadhaar after 90 days",
                      },
                    ],
                    "Lost Application": [
                      {
                        slNo: "1",
                        stepDetails: "Visit UIDAI website or center",
                      },
                      {
                        slNo: "2",
                        stepDetails: "Provide enrollment number or biometric",
                      },
                      { slNo: "3", stepDetails: "Pay reprint fee" },
                      { slNo: "4", stepDetails: "Download reprinted Aadhaar" },
                    ],
                    "Update Application": [
                      {
                        slNo: "1",
                        stepDetails: "Visit Aadhaar enrollment center",
                      },
                      { slNo: "2", stepDetails: "Fill update request form" },
                      {
                        slNo: "3",
                        stepDetails: "Provide supporting documents",
                      },
                      {
                        slNo: "4",
                        stepDetails: "Pay update fee if applicable",
                      },
                    ],
                    "Surrender Application": [
                      { slNo: "1", stepDetails: "Contact UIDAI helpline" },
                      { slNo: "2", stepDetails: "Submit deactivation request" },
                      { slNo: "3", stepDetails: "Provide valid reason" },
                      { slNo: "4", stepDetails: "Receive confirmation" },
                    ],
                  },
                  documents: {
                    "New Application": [
                      {
                        slNo: "1",
                        documentType: "Proof of Identity",
                        validProof: "Passport, Driving License, PAN Card",
                      },
                      {
                        slNo: "2",
                        documentType: "Proof of Address",
                        validProof: "Utility Bills, Bank Statement",
                      },
                      {
                        slNo: "3",
                        documentType: "Proof of Date of Birth",
                        validProof: "Birth Certificate, School Certificate",
                      },
                    ],
                    "Lost Application": [
                      {
                        slNo: "1",
                        documentType: "Enrollment Receipt",
                        validProof: "Original enrollment slip",
                      },
                      {
                        slNo: "2",
                        documentType: "Identity Proof",
                        validProof: "Any government ID",
                      },
                    ],
                    "Update Application": [
                      {
                        slNo: "1",
                        documentType: "Current Aadhaar",
                        validProof: "Aadhaar Card/e-Aadhaar",
                      },
                      {
                        slNo: "2",
                        documentType: "Supporting Document",
                        validProof: "Document for field to be updated",
                      },
                    ],
                    "Surrender Application": [
                      {
                        slNo: "1",
                        documentType: "Aadhaar Card",
                        validProof: "Original Aadhaar Card",
                      },
                      {
                        slNo: "2",
                        documentType: "Request Letter",
                        validProof: "Written application with reason",
                      },
                    ],
                  },
                  eligibility: {
                    "New Application": [
                      "Indian Resident",
                      "Any age",
                      "Should not have existing Aadhaar",
                    ],
                    "Lost Application": [
                      "Must have enrolled for Aadhaar previously",
                      "Should remember enrollment details",
                    ],
                    "Update Application": [
                      "Must have existing Aadhaar",
                      "Valid reason for update",
                    ],
                    "Surrender Application": [
                      "Must have existing Aadhaar",
                      "Valid reason for deactivation",
                    ],
                  },
                  contact: {
                    "New Application": [
                      {
                        serviceName: "Aadhaar Enrollment",
                        district: "All Districts",
                        subDistrict: "All Sub Districts",
                        block: "All Blocks",
                        name: "UIDAI Helpdesk",
                        designation: "Customer Support",
                        contact: "1947",
                        email: "help@uidai.gov.in",
                      },
                    ],
                    "Lost Application": [
                      {
                        serviceName: "Aadhaar Reprint",
                        district: "All Districts",
                        subDistrict: "All Sub Districts",
                        block: "All Blocks",
                        name: "UIDAI Support",
                        designation: "Technical Support",
                        contact: "1947",
                        email: "support@uidai.gov.in",
                      },
                    ],
                    "Update Application": [
                      {
                        serviceName: "Aadhaar Update",
                        district: "All Districts",
                        subDistrict: "All Sub Districts",
                        block: "All Blocks",
                        name: "Update Center",
                        designation: "Update Officer",
                        contact: "1947",
                        email: "update@uidai.gov.in",
                      },
                    ],
                    "Surrender Application": [
                      {
                        serviceName: "Aadhaar Deactivation",
                        district: "All Districts",
                        subDistrict: "All Sub Districts",
                        block: "All Blocks",
                        name: "Deactivation Team",
                        designation: "Senior Officer",
                        contact: "1947",
                        email: "deactivate@uidai.gov.in",
                      },
                    ],
                  },
                },
                {
                  id: "dummy-birth",
                  name: "Birth Certificate",
                  abbreviation: "BC",
                  summary: "Official record of birth issued by government.",
                  applicationMode: "Offline",
                  status: "published",
                  processSteps: {
                    "New Application": [
                      {
                        slNo: "1",
                        stepDetails: "Visit Registrar of Births office",
                      },
                      { slNo: "2", stepDetails: "Fill application form" },
                      { slNo: "3", stepDetails: "Submit required documents" },
                      { slNo: "4", stepDetails: "Pay prescribed fee" },
                      {
                        slNo: "5",
                        stepDetails: "Collect certificate after processing",
                      },
                    ],
                    "Lost Application": [
                      {
                        slNo: "1",
                        stepDetails: "Visit Registrar office with affidavit",
                      },
                      {
                        slNo: "2",
                        stepDetails: "Fill duplicate certificate form",
                      },
                      { slNo: "3", stepDetails: "Pay duplicate fee" },
                      {
                        slNo: "4",
                        stepDetails: "Collect duplicate certificate",
                      },
                    ],
                    "Update Application": [
                      {
                        slNo: "1",
                        stepDetails: "Submit correction application",
                      },
                      {
                        slNo: "2",
                        stepDetails: "Provide supporting documents",
                      },
                      { slNo: "3", stepDetails: "Pay correction fee" },
                      {
                        slNo: "4",
                        stepDetails: "Wait for verification and approval",
                      },
                    ],
                    "Surrender Application": [
                      {
                        slNo: "1",
                        stepDetails: "Not applicable for birth certificates",
                      },
                    ],
                  },
                  documents: {
                    "New Application": [
                      {
                        slNo: "1",
                        documentType: "Hospital Birth Record",
                        validProof: "Hospital issued birth record",
                      },
                      {
                        slNo: "2",
                        documentType: "Parents ID Proof",
                        validProof: "Aadhaar, Passport, Driving License",
                      },
                      {
                        slNo: "3",
                        documentType: "Address Proof",
                        validProof: "Utility bills, Bank statement",
                      },
                    ],
                    "Lost Application": [
                      {
                        slNo: "1",
                        documentType: "Affidavit",
                        validProof: "Notarized affidavit for lost certificate",
                      },
                      {
                        slNo: "2",
                        documentType: "ID Proof",
                        validProof: "Any government issued ID",
                      },
                    ],
                    "Update Application": [
                      {
                        slNo: "1",
                        documentType: "Original Certificate",
                        validProof: "Birth certificate to be corrected",
                      },
                      {
                        slNo: "2",
                        documentType: "Supporting Document",
                        validProof: "Document supporting the correction",
                      },
                    ],
                    "Surrender Application": [
                      {
                        slNo: "1",
                        documentType: "Not Applicable",
                        validProof: "Birth certificates cannot be surrendered",
                      },
                    ],
                  },
                  eligibility: {
                    "New Application": [
                      "Birth registered in the district",
                      "Within time limit or with late fee",
                    ],
                    "Lost Application": [
                      "Must have original birth certificate issued",
                      "Valid reason for duplicate",
                    ],
                    "Update Application": [
                      "Must have original certificate",
                      "Valid supporting documents for correction",
                    ],
                    "Surrender Application": ["Not applicable"],
                  },
                  contact: {
                    "New Application": [
                      {
                        serviceName: "Birth Registration",
                        district: "Local District",
                        subDistrict: "Local Sub District",
                        block: "Local Block",
                        name: "Registrar of Births",
                        designation: "Deputy Registrar",
                        contact: "0120-2345678",
                        email: "birth.registrar@gov.in",
                      },
                    ],
                    "Lost Application": [
                      {
                        serviceName: "Duplicate Birth Certificate",
                        district: "Local District",
                        subDistrict: "Local Sub District",
                        block: "Local Block",
                        name: "Assistant Registrar",
                        designation: "Certificate Officer",
                        contact: "0120-2345679",
                        email: "duplicate.birth@gov.in",
                      },
                    ],
                    "Update Application": [
                      {
                        serviceName: "Birth Certificate Correction",
                        district: "Local District",
                        subDistrict: "Local Sub District",
                        block: "Local Block",
                        name: "Correction Officer",
                        designation: "Senior Clerk",
                        contact: "0120-2345680",
                        email: "correction.birth@gov.in",
                      },
                    ],
                    "Surrender Application": [
                      {
                        serviceName: "Not Applicable",
                        district: "N/A",
                        subDistrict: "N/A",
                        block: "N/A",
                        name: "N/A",
                        designation: "N/A",
                        contact: "N/A",
                        email: "N/A",
                      },
                    ],
                  },
                },
                {
                  id: "dummy-license",
                  name: "Driver's License",
                  abbreviation: "DL",
                  summary: "License to legally drive vehicles.",
                  applicationMode: "Online/Offline",
                  status: "published",
                  processSteps: {
                    "New Application": [
                      {
                        slNo: "1",
                        stepDetails: "Apply for learner's license first",
                      },
                      {
                        slNo: "2",
                        stepDetails: "Pass written test for traffic rules",
                      },
                      {
                        slNo: "3",
                        stepDetails: "Practice driving for minimum period",
                      },
                      { slNo: "4", stepDetails: "Apply for permanent license" },
                      { slNo: "5", stepDetails: "Pass driving test" },
                      { slNo: "6", stepDetails: "Collect driving license" },
                    ],
                    "Lost Application": [
                      { slNo: "1", stepDetails: "File FIR for lost license" },
                      { slNo: "2", stepDetails: "Visit RTO with FIR copy" },
                      {
                        slNo: "3",
                        stepDetails: "Fill duplicate license application",
                      },
                      { slNo: "4", stepDetails: "Pay duplicate fee" },
                      { slNo: "5", stepDetails: "Collect duplicate license" },
                    ],
                    "Update Application": [
                      {
                        slNo: "1",
                        stepDetails: "Visit RTO for renewal/update",
                      },
                      {
                        slNo: "2",
                        stepDetails: "Submit medical certificate if required",
                      },
                      { slNo: "3", stepDetails: "Pay renewal fee" },
                      { slNo: "4", stepDetails: "Update photo and signature" },
                      { slNo: "5", stepDetails: "Collect updated license" },
                    ],
                    "Surrender Application": [
                      {
                        slNo: "1",
                        stepDetails: "Submit surrender application to RTO",
                      },
                      { slNo: "2", stepDetails: "Return original license" },
                      { slNo: "3", stepDetails: "State reason for surrender" },
                      {
                        slNo: "4",
                        stepDetails: "Receive surrender confirmation",
                      },
                    ],
                  },
                  documents: {
                    "New Application": [
                      {
                        slNo: "1",
                        documentType: "Age Proof",
                        validProof: "Birth Certificate, 10th Certificate",
                      },
                      {
                        slNo: "2",
                        documentType: "Address Proof",
                        validProof: "Aadhaar, Utility Bills",
                      },
                      {
                        slNo: "3",
                        documentType: "Medical Certificate",
                        validProof: "Medical fitness from approved doctor",
                      },
                    ],
                    "Lost Application": [
                      {
                        slNo: "1",
                        documentType: "FIR Copy",
                        validProof: "Police FIR for lost license",
                      },
                      {
                        slNo: "2",
                        documentType: "ID Proof",
                        validProof: "Aadhaar, Passport",
                      },
                      {
                        slNo: "3",
                        documentType: "Affidavit",
                        validProof: "Notarized affidavit",
                      },
                    ],
                    "Update Application": [
                      {
                        slNo: "1",
                        documentType: "Current License",
                        validProof: "Existing driving license",
                      },
                      {
                        slNo: "2",
                        documentType: "Medical Certificate",
                        validProof: "Fresh medical certificate if required",
                      },
                    ],
                    "Surrender Application": [
                      {
                        slNo: "1",
                        documentType: "Original License",
                        validProof: "Current driving license",
                      },
                      {
                        slNo: "2",
                        documentType: "Application Letter",
                        validProof: "Written application with reason",
                      },
                    ],
                  },
                  eligibility: {
                    "New Application": [
                      "Minimum 18 years for car",
                      "16 years for two-wheeler",
                      "Should pass medical test",
                    ],
                    "Lost Application": [
                      "Must have valid license previously",
                      "FIR should be filed",
                    ],
                    "Update Application": [
                      "Valid existing license",
                      "Medical fitness if required",
                    ],
                    "Surrender Application": [
                      "Valid existing license",
                      "Valid reason for surrender",
                    ],
                  },
                  contact: {
                    "New Application": [
                      {
                        serviceName: "Driving License",
                        district: "Local District",
                        subDistrict: "Local Sub District",
                        block: "Local Block",
                        name: "RTO Officer",
                        designation: "Motor Vehicle Inspector",
                        contact: "0120-3456789",
                        email: "license@rto.gov.in",
                      },
                    ],
                    "Lost Application": [
                      {
                        serviceName: "Duplicate License",
                        district: "Local District",
                        subDistrict: "Local Sub District",
                        block: "Local Block",
                        name: "Duplicate Section",
                        designation: "Assistant RTO",
                        contact: "0120-3456790",
                        email: "duplicate@rto.gov.in",
                      },
                    ],
                    "Update Application": [
                      {
                        serviceName: "License Renewal",
                        district: "Local District",
                        subDistrict: "Local Sub District",
                        block: "Local Block",
                        name: "Renewal Officer",
                        designation: "Senior Clerk",
                        contact: "0120-3456791",
                        email: "renewal@rto.gov.in",
                      },
                    ],
                    "Surrender Application": [
                      {
                        serviceName: "License Surrender",
                        district: "Local District",
                        subDistrict: "Local Sub District",
                        block: "Local Block",
                        name: "Surrender Section",
                        designation: "RTO Clerk",
                        contact: "0120-3456792",
                        email: "surrender@rto.gov.in",
                      },
                    ],
                  },
                },
              ].map((cert) => (
                <Card
                  key={cert.id}
                  className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardTitle>{cert.name}</CardTitle>
                    <CardDescription>{cert.summary}</CardDescription>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Abbreviation:</span>{" "}
                        {cert.abbreviation}
                      </div>
                      <div>
                        <span className="font-semibold">Application Mode:</span>{" "}
                        {cert.applicationMode}
                      </div>
                    </div>
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

              {/* API Certificate Service Cards */}
              {filteredApiCerts.map((cert) => (
                <Card
                  key={`api-${cert.id}`}
                  className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <CardHeader>
                    <CardTitle>{cert.name}</CardTitle>
                    <CardDescription>{cert.summary}</CardDescription>
                    <div className="mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Abbreviation:</span>{" "}
                        {cert.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold">Application Mode:</span>{" "}
                        {cert.applicationMode === "both"
                          ? "Online/Offline"
                          : cert.applicationMode === "online"
                            ? "Online"
                            : "Offline"}
                      </div>
                      {cert.onlineUrl && (
                        <div>
                          <span className="font-semibold">URL:</span>{" "}
                          <a
                            href={cert.onlineUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {cert.onlineUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() =>
                        setModalCert({
                          ...cert,
                          abbreviation: cert.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase(),
                          // Transform API data to match modal expectations
                          processSteps: {
                            "New Application": cert.processNew
                              ? cert.processNew
                                  .split("\n")
                                  .filter((step) => step.trim())
                                  .map((step, index) => ({
                                    slNo: (index + 1).toString(),
                                    stepDetails: step.trim(),
                                  }))
                              : [],
                            "Update Application": cert.processUpdate
                              ? cert.processUpdate
                                  .split("\n")
                                  .filter((step) => step.trim())
                                  .map((step, index) => ({
                                    slNo: (index + 1).toString(),
                                    stepDetails: step.trim(),
                                  }))
                              : [],
                            "Lost Application": cert.processLost
                              ? cert.processLost
                                  .split("\n")
                                  .filter((step) => step.trim())
                                  .map((step, index) => ({
                                    slNo: (index + 1).toString(),
                                    stepDetails: step.trim(),
                                  }))
                              : [],
                            "Surrender Application": cert.processSurrender
                              ? cert.processSurrender
                                  .split("\n")
                                  .filter((step) => step.trim())
                                  .map((step, index) => ({
                                    slNo: (index + 1).toString(),
                                    stepDetails: step.trim(),
                                  }))
                              : [],
                          },
                          documents: {
                            "New Application":
                              cert.documents
                                ?.filter(
                                  (doc) =>
                                    doc.applicationType === "New" ||
                                    !doc.applicationType,
                                )
                                .map((doc, index) => ({
                                  slNo: (index + 1).toString(),
                                  documentType: doc.documentType,
                                  validProof: doc.validProof,
                                })) || [],
                            "Update Application":
                              cert.documents
                                ?.filter(
                                  (doc) => doc.applicationType === "Update",
                                )
                                .map((doc, index) => ({
                                  slNo: (index + 1).toString(),
                                  documentType: doc.documentType,
                                  validProof: doc.validProof,
                                })) || [],
                            "Lost Application":
                              cert.documents
                                ?.filter(
                                  (doc) => doc.applicationType === "Lost",
                                )
                                .map((doc, index) => ({
                                  slNo: (index + 1).toString(),
                                  documentType: doc.documentType,
                                  validProof: doc.validProof,
                                })) || [],
                            "Surrender Application":
                              cert.documents
                                ?.filter(
                                  (doc) => doc.applicationType === "Surrender",
                                )
                                .map((doc, index) => ({
                                  slNo: (index + 1).toString(),
                                  documentType: doc.documentType,
                                  validProof: doc.validProof,
                                })) || [],
                          },
                          eligibility: {
                            "New Application": cert.eligibilityDetails || [],
                            "Update Application": cert.eligibilityDetails || [],
                            "Lost Application": cert.eligibilityDetails || [],
                            "Surrender Application":
                              cert.eligibilityDetails || [],
                          },
                          contact: {
                            "New Application":
                              cert.contacts?.filter(
                                (contact) =>
                                  contact.applicationType === "New" ||
                                  !contact.applicationType,
                              ) || [],
                            "Update Application":
                              cert.contacts?.filter(
                                (contact) =>
                                  contact.applicationType === "Update",
                              ) || [],
                            "Lost Application":
                              cert.contacts?.filter(
                                (contact) => contact.applicationType === "Lost",
                              ) || [],
                            "Surrender Application":
                              cert.contacts?.filter(
                                (contact) =>
                                  contact.applicationType === "Surrender",
                              ) || [],
                          },
                        })
                      }
                      className="w-full mt-2 bg-blue-600 text-white"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* No Services Message */}
              {filteredApiCerts.length === 0 &&
                search && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">
                      No certificate services found matching "{search}".
                    </p>
                  </div>
                )}
            </div>
          )}
          {/* Modal for Certificate Details */}
          {modalCert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 relative animate-fade-in overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setModalCert(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{modalCert.name}</h2>
                <p className="mb-4 text-gray-700">{modalCert.summary}</p>

                {/* Application Type Dropdown */}
                {modalCert.processSteps && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Application Type
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
                        <SelectItem value="Lost Application">
                          Lost Application
                        </SelectItem>
                        <SelectItem value="Update Application">
                          Update Application
                        </SelectItem>
                        <SelectItem value="Surrender Application">
                          Surrender Application
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Process Steps */}
                {modalCert.processSteps &&
                  modalCert.processSteps[selectedApplicationType] && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-lg">
                        Process Steps for {selectedApplicationType}
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {modalCert.processSteps[selectedApplicationType].map(
                          (step, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{step.slNo}.</span>{" "}
                              {step.stepDetails}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {/* Documents */}
                {modalCert.documents &&
                  modalCert.documents[selectedApplicationType] && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-lg">
                        Required Documents for {selectedApplicationType}
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {modalCert.documents[selectedApplicationType].map(
                          (doc, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{doc.slNo}.</span>{" "}
                              <span className="font-medium">
                                {doc.documentType}
                              </span>{" "}
                              - Valid Proof: {doc.validProof}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {/* Eligibility */}
                {modalCert.eligibility &&
                  modalCert.eligibility[selectedApplicationType] && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-lg">
                        Eligibility Criteria for {selectedApplicationType}
                      </h3>
                      <ul className="list-disc pl-6 space-y-1">
                        {modalCert.eligibility[selectedApplicationType].map(
                          (criteria, idx) => (
                            <li key={idx}>{criteria}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                {/* Contact Person */}
                {modalCert.contact &&
                  modalCert.contact[selectedApplicationType] && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 text-lg">
                        Contact Details for {selectedApplicationType}
                      </h3>
                      {modalCert.contact[selectedApplicationType].map(
                        (contactItem, idx) => (
                          <div
                            key={idx}
                            className="border border-gray-200 rounded-lg p-4 mb-4"
                          >
                            <h4 className="font-medium mb-2">
                              Contact Person {idx + 1}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">
                                  Service Name:
                                </span>{" "}
                                {contactItem.serviceName}
                              </div>
                              <div>
                                <span className="font-medium">District:</span>{" "}
                                {contactItem.district}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Sub District:
                                </span>{" "}
                                {contactItem.subDistrict}
                              </div>
                              <div>
                                <span className="font-medium">Block:</span>{" "}
                                {contactItem.block}
                              </div>
                              <div>
                                <span className="font-medium">Name:</span>{" "}
                                {contactItem.name}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Designation:
                                </span>{" "}
                                {contactItem.designation}
                              </div>
                              <div>
                                <span className="font-medium">Contact:</span>{" "}
                                {contactItem.contact}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span>{" "}
                                {contactItem.email}
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}

                {/* Basic Certificate Info for non-dummy certificates */}
                {!modalCert.processSteps && (
                  <>
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
                      <h3 className="font-semibold mb-2">
                        Supportive Documents
                      </h3>
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
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
