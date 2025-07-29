import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getServices,
  updateService,
  getServiceByName,
} from "../lib/localStorageUtils";

export default function EditCertificateService() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState({
    name: "",
    certificateAbbreviation: "",
    summary: "",
    applicationMode: "",
    eligibility: [""],
    contactName: "",
    designation: "",
    contact: "",
    email: "",
    district: "",
    subDistrict: "",
    block: "",
    serviceDetails: "",
    status: "active",
    processNew: "",
    processUpdate: "",
    processLost: "",
    processSurrender: "",
    docNew: "",
    docUpdate: "",
    docLost: "",
    docSurrender: "",
    onlineUrl: "",
    offlineAddress: "",
  });
  // Separate state for each application type
  const [processSteps, setProcessSteps] = useState({
    "New Application": [{ slNo: "1", stepDetails: "" }],
    "Lost Application": [{ slNo: "1", stepDetails: "" }],
    "Update Application": [{ slNo: "1", stepDetails: "" }],
    "Surrender Application": [{ slNo: "1", stepDetails: "" }],
  });

  const [documents, setDocuments] = useState({
    "New Application": [{ slNo: "1", documentType: "", validProof: "" }],
    "Lost Application": [{ slNo: "1", documentType: "", validProof: "" }],
    "Update Application": [{ slNo: "1", documentType: "", validProof: "" }],
    "Surrender Application": [{ slNo: "1", documentType: "", validProof: "" }],
  });

  const [eligibility, setEligibility] = useState({
    "New Application": [""],
    "Lost Application": [""],
    "Update Application": [""],
    "Surrender Application": [""],
  });

  const [contact, setContact] = useState({
    "New Application": [
      {
        serviceName: "",
        district: "",
        subDistrict: "",
        block: "",
        name: "",
        designation: "",
        contact: "",
        email: "",
      },
    ],
    "Lost Application": [
      {
        serviceName: "",
        district: "",
        subDistrict: "",
        block: "",
        name: "",
        designation: "",
        contact: "",
        email: "",
      },
    ],
    "Update Application": [
      {
        serviceName: "",
        district: "",
        subDistrict: "",
        block: "",
        name: "",
        designation: "",
        contact: "",
        email: "",
      },
    ],
    "Surrender Application": [
      {
        serviceName: "",
        district: "",
        subDistrict: "",
        block: "",
        name: "",
        designation: "",
        contact: "",
        email: "",
      },
    ],
  });

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [processType, setProcessType] = useState<string>("New Application");

  useEffect(() => {
    const cert = getServiceByName(decodeURIComponent(name || ""));
    if (cert) {
      setServiceData({
        name: cert.name || "",
        certificateAbbreviation: (cert as any).certificateAbbreviation || "",
        summary: cert.summary || "",
        applicationMode: cert.applicationMode || "",
        eligibility: cert.eligibility ? [cert.eligibility] : [""],
        contactName: cert.contactName || "",
        designation: cert.designation || "",
        contact: cert.contact || "",
        email: cert.email || "",
        district: cert.district || "",
        subDistrict: cert.subDistrict || "",
        block: cert.block || "",
        serviceDetails: cert.serviceDetails || "",
        status: cert.status || "active",
        processNew: cert.processNew || "",
        processUpdate: cert.processUpdate || "",
        processLost: cert.processLost || "",
        processSurrender: cert.processSurrender || "",
        docNew: cert.docNew || "",
        docUpdate: cert.docUpdate || "",
        docLost: cert.docLost || "",
        docSurrender: cert.docSurrender || "",
        onlineUrl: (cert as any).onlineUrl || "",
        offlineAddress: (cert as any).offlineAddress || "",
      });

      // For now, initialize with default values until we implement saving
      // In future, these could be loaded from cert.processStepsNew, etc.
      setProcessSteps({
        "New Application": [{ slNo: "1", stepDetails: "" }],
        "Lost Application": [{ slNo: "1", stepDetails: "" }],
        "Update Application": [{ slNo: "1", stepDetails: "" }],
        "Surrender Application": [{ slNo: "1", stepDetails: "" }],
      });

      setDocuments({
        "New Application": [{ slNo: "1", documentType: "", validProof: "" }],
        "Lost Application": [{ slNo: "1", documentType: "", validProof: "" }],
        "Update Application": [{ slNo: "1", documentType: "", validProof: "" }],
        "Surrender Application": [
          { slNo: "1", documentType: "", validProof: "" },
        ],
      });

      setEligibility({
        "New Application": [""],
        "Lost Application": [""],
        "Update Application": [""],
        "Surrender Application": [""],
      });

      const defaultContact = {
        serviceName: "",
        district: "",
        subDistrict: "",
        block: "",
        name: "",
        designation: "",
        contact: "",
        email: "",
      };

      setContact({
        "New Application": [defaultContact],
        "Lost Application": [defaultContact],
        "Update Application": [defaultContact],
        "Surrender Application": [defaultContact],
      });
    }
  }, [name]);

  const addProcessStep = () => {
    setProcessSteps((prev) => ({
      ...prev,
      [processType]: [
        ...prev[processType],
        { slNo: String(prev[processType].length + 1), stepDetails: "" },
      ],
    }));
  };

  const removeProcessStep = (idx) => {
    setProcessSteps((prev) => ({
      ...prev,
      [processType]:
        prev[processType].length > 1
          ? prev[processType].filter((_, i) => i !== idx)
          : prev[processType],
    }));
  };

  const handleProcessStepChange = (idx, field, value) => {
    setProcessSteps((prev) => ({
      ...prev,
      [processType]: prev[processType].map((step, i) =>
        i === idx ? { ...step, [field]: value } : step,
      ),
    }));
  };

  const addDocument = () => {
    setDocuments((prev) => ({
      ...prev,
      [processType]: [
        ...prev[processType],
        {
          slNo: String(prev[processType].length + 1),
          documentType: "",
          validProof: "",
        },
      ],
    }));
  };

  const removeDocument = (idx) => {
    setDocuments((prev) => ({
      ...prev,
      [processType]:
        prev[processType].length > 1
          ? prev[processType].filter((_, i) => i !== idx)
          : prev[processType],
    }));
  };

  const handleDocumentChange = (idx, field, value) => {
    setDocuments((prev) => ({
      ...prev,
      [processType]: prev[processType].map((doc, i) =>
        i === idx ? { ...doc, [field]: value } : doc,
      ),
    }));
  };

  const addEligibility = () => {
    setEligibility((prev) => ({
      ...prev,
      [processType]: [...prev[processType], ""],
    }));
  };

  const removeEligibility = (idx: number) => {
    setEligibility((prev) => ({
      ...prev,
      [processType]: prev[processType].filter((_, i) => i !== idx),
    }));
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    contactIndex: number,
  ) => {
    setContact((prev) => ({
      ...prev,
      [processType]: prev[processType].map((contactItem, index) =>
        index === contactIndex
          ? { ...contactItem, [e.target.name]: e.target.value }
          : contactItem,
      ),
    }));
  };

  const addContact = () => {
    setContact((prev) => ({
      ...prev,
      [processType]: [
        ...prev[processType],
        {
          serviceName: "",
          district: "",
          subDistrict: "",
          block: "",
          name: "",
          designation: "",
          contact: "",
          email: "",
        },
      ],
    }));
  };

  const removeContact = (contactIndex: number) => {
    setContact((prev) => ({
      ...prev,
      [processType]:
        prev[processType].length > 1
          ? prev[processType].filter((_, index) => index !== contactIndex)
          : prev[processType],
    }));
  };

  const importContactDetails = () => {
    if (processType !== "New Application") {
      setContact((prev) => ({
        ...prev,
        [processType]: [...prev["New Application"]],
      }));
    }
  };

  const saveData = (publishStatus?) => {
    const services = getServices();
    const idx = services.findIndex(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (idx !== -1) {
      const serviceToUpdate = {
        ...services[idx],
        ...serviceData,
        processSteps,
        documents,
        eligibility,
        contact,
      };
      if (publishStatus) {
        serviceToUpdate.status = publishStatus;
      }
      updateService(serviceToUpdate);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    saveData("published");
    navigate("/admin-certificate-service");
  };

  const handleSaveForLater = () => {
    saveData();
    navigate("/admin-certificate-service");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Edit Certificate Service: {decodeURIComponent(name || "")}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Service Details and Action Buttons */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Overview of the certificate service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <div>
                  <span className="font-semibold">Certificate Name:</span>{" "}
                  {serviceData.name}
                </div>
                <div>
                  <span className="font-semibold">
                    Certificate Abbreviation:
                  </span>{" "}
                  {serviceData.certificateAbbreviation}
                </div>
                <div>
                  <span className="font-semibold">Summary:</span>{" "}
                  {serviceData.summary}
                </div>
                <div>
                  <span className="font-semibold">Application Mode:</span>{" "}
                  {serviceData.applicationMode}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-4">
            <Button onClick={() => setActiveForm("process")}>
              Add Process
            </Button>
            <Button onClick={() => setActiveForm("documents")}>
              Add Documents
            </Button>
            <Button onClick={() => setActiveForm("eligibility")}>
              Add Eligibility
            </Button>
            <Button onClick={() => setActiveForm("contact")}>
              Add Contact Person
            </Button>
            <Button variant="outline">Preview</Button>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2">
          {activeForm === "process" && (
            <Card>
              <CardHeader>
                <CardTitle>Add Process Steps</CardTitle>
                <CardDescription>
                  Define the process for each application type.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={
                      processType === "New Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("New Application")}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={
                      processType === "Lost Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("Lost Application")}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={
                      processType === "Update Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Update Application")}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={
                      processType === "Surrender Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Surrender Application")}
                  >
                    Surrender Application
                  </Button>
                </div>

                <h3 className="font-semibold mb-2">Steps for {processType}</h3>
                {processSteps[processType].map((step, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={step.slNo}
                      onChange={(e) =>
                        handleProcessStepChange(idx, "slNo", e.target.value)
                      }
                      placeholder="Sl. No."
                      className="w-20"
                    />
                    <Input
                      value={step.stepDetails}
                      onChange={(e) =>
                        handleProcessStepChange(
                          idx,
                          "stepDetails",
                          e.target.value,
                        )
                      }
                      placeholder="Enter step details"
                    />
                    {processSteps[processType].length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeProcessStep(idx)}
                      >
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addProcessStep}>
                  + Add Step
                </Button>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => console.log("Save Process")}
                  >
                    Save Process
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeForm === "documents" && (
            <Card>
              <CardHeader>
                <CardTitle>Add Supportive Documents</CardTitle>
                <CardDescription>
                  List required documents for this certificate service.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={
                      processType === "New Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("New Application")}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={
                      processType === "Lost Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("Lost Application")}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={
                      processType === "Update Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Update Application")}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={
                      processType === "Surrender Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Surrender Application")}
                  >
                    Surrender Application
                  </Button>
                </div>
                <h3 className="font-semibold mb-2">
                  Documents for {processType}
                </h3>
                {documents[processType].map((doc, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={doc.slNo}
                      onChange={(e) =>
                        handleDocumentChange(idx, "slNo", e.target.value)
                      }
                      placeholder="Sl. No."
                      className="w-20"
                    />
                    <Input
                      value={doc.documentType}
                      onChange={(e) =>
                        handleDocumentChange(
                          idx,
                          "documentType",
                          e.target.value,
                        )
                      }
                      placeholder="Enter document type"
                    />
                    <Input
                      value={doc.validProof}
                      onChange={(e) =>
                        handleDocumentChange(idx, "validProof", e.target.value)
                      }
                      placeholder="Enter valid proof"
                    />
                    {documents[processType].length > 1 && (
                      <Button type="button" onClick={() => removeDocument(idx)}>
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addDocument}>
                  + Add Document
                </Button>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => console.log("Save Documents")}
                  >
                    Save Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeForm === "eligibility" && (
            <Card>
              <CardHeader>
                <CardTitle>Add Eligibility Criteria</CardTitle>
                <CardDescription>
                  Define who is eligible for this service.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={
                      processType === "New Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("New Application")}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={
                      processType === "Lost Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("Lost Application")}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={
                      processType === "Update Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Update Application")}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={
                      processType === "Surrender Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Surrender Application")}
                  >
                    Surrender Application
                  </Button>
                </div>
                <h3 className="font-semibold mb-2">
                  Eligibility for {processType}
                </h3>
                {eligibility[processType].map((eligibilityItem, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={eligibilityItem}
                      onChange={(e) => {
                        setEligibility((prev) => ({
                          ...prev,
                          [processType]: prev[processType].map((item, i) =>
                            i === idx ? e.target.value : item,
                          ),
                        }));
                      }}
                      placeholder="Enter eligibility criteria"
                      className="flex-grow min-h-[40px] max-h-[60px] resize-none"
                    />
                    {eligibility[processType].length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeEligibility(idx)}
                      >
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addEligibility}>
                  + Add Eligibility
                </Button>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => console.log("Save Eligibility")}
                  >
                    Save Eligibility
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeForm === "contact" && (
            <Card>
              <CardHeader>
                <CardTitle>Add Contact Person</CardTitle>
                <CardDescription>
                  Provide contact details for this certificate service.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={
                      processType === "New Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("New Application")}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={
                      processType === "Lost Application" ? "default" : "outline"
                    }
                    onClick={() => setProcessType("Lost Application")}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={
                      processType === "Update Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Update Application")}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={
                      processType === "Surrender Application"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setProcessType("Surrender Application")}
                  >
                    Surrender Application
                  </Button>
                </div>
                <h3 className="font-semibold mb-2">
                  Contact Details for {processType}
                </h3>
                {processType !== "New Application" && (
                  <div className="mb-4">
                    <Button
                      type="button"
                      onClick={importContactDetails}
                      variant="outline"
                      className="w-full"
                    >
                      📋 Import Details from New Application
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to copy all contact details from New Application to{" "}
                      {processType}
                    </p>
                  </div>
                )}
                {contact[processType].map((contactItem, contactIdx) => (
                  <div
                    key={contactIdx}
                    className="border border-gray-200 rounded-lg p-4 mb-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        Contact Person {contactIdx + 1}
                      </h4>
                      {contact[processType].length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeContact(contactIdx)}
                          variant="outline"
                          size="sm"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        name="district"
                        value={contactItem.district}
                        onChange={(e) => handleContactChange(e, contactIdx)}
                        placeholder="District"
                      />
                      <Input
                        name="subDistrict"
                        value={contactItem.subDistrict}
                        onChange={(e) => handleContactChange(e, contactIdx)}
                        placeholder="Sub District"
                      />
                      <Input
                        name="block"
                        value={contactItem.block}
                        onChange={(e) => handleContactChange(e, contactIdx)}
                        placeholder="Block"
                      />
                      <Input
                        name="name"
                        value={contactItem.name}
                        onChange={(e) => handleContactChange(e, contactIdx)}
                        placeholder="Contact Person's Name"
                      />
                      <Input
                        name="designation"
                        value={contactItem.designation}
                        onChange={(e) => handleContactChange(e, contactIdx)}
                        placeholder="Designation"
                      />
                      <Input
                        name="contact"
                        value={contactItem.contact}
                        onChange={(e) => handleContactChange(e, contactIdx)}
                        placeholder="Contact Number"
                      />
                      <Input
                        name="email"
                        value={contactItem.email}
                        onChange={(e) => handleContactChange(e, contactIdx)}
                        placeholder="Email Address"
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addContact} className="mb-4">
                  + Add Contact Person
                </Button>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    type="button"
                    onClick={() => setActiveForm(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => console.log("Save Contact")}
                  >
                    Save Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeForm === null && (
            <Card>
              <CardHeader>
                <CardTitle>Select an option</CardTitle>
                <CardDescription>
                  Choose an action from the left panel to add or edit details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>No form selected.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
