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
import { getServices, updateService, getServiceByName } from "../lib/localStorageUtils";

export default function EditCertificateService() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [serviceName, setServiceName] = useState("");
  const [processSteps, setProcessSteps] = useState([
    { slNo: "1", stepDetails: "" },
  ]);
  const [docServiceName, setDocServiceName] = useState("");
  const [documents, setDocuments] = useState([
    { slNo: "1", documentType: "", validProof: "" },
  ]);
  const [contact, setContact] = useState({
    serviceName: "",
    district: "",
    subDistrict: "",
    block: "",
    name: "",
    designation: "",
    contact: "",
    email: "",
  });
  const [serviceDetails, setServiceDetails] = useState("");
  const [status, setStatus] = useState("Active");
  const [processNew, setProcessNew] = useState("");
  const [processUpdate, setProcessUpdate] = useState("");
  const [processLost, setProcessLost] = useState("");
  const [processSurrender, setProcessSurrender] = useState("");

  useEffect(() => {
    const cert = getServiceByName(decodeURIComponent(name || ""));
    if (cert) {
      setServiceName(cert.serviceName || "");
      setProcessSteps(cert.processSteps || [{ slNo: "1", stepDetails: "" }]);
      setDocServiceName(cert.docServiceName || "");
      setDocuments(
        cert.documents || [{ slNo: "1", documentType: "", validProof: "" }],
      );
      setContact(
        cert.contact || {
          serviceName: "",
          district: "",
          subDistrict: "",
          block: "",
          name: "",
          designation: "",
          contact: "",
          email: "",
        },
      );
      setServiceDetails(cert.serviceDetails || "");
      setStatus(cert.status || "Active");
      setProcessNew(cert.processNew || "");
      setProcessUpdate(cert.processUpdate || "");
      setProcessLost(cert.processLost || "");
      setProcessSurrender(cert.processSurrender || "");
    }
  }, [name]);

  const addProcessStep = () =>
    setProcessSteps([
      ...processSteps,
      { slNo: String(processSteps.length + 1), stepDetails: "" },
    ]);
  const removeProcessStep = (idx) =>
    processSteps.length > 1 &&
    setProcessSteps(processSteps.filter((_, i) => i !== idx));
  const handleProcessStepChange = (idx, field, value) =>
    setProcessSteps(
      processSteps.map((step, i) =>
        i === idx ? { ...step, [field]: value } : step,
      ),
    );

  const addDocument = () =>
    setDocuments([
      ...documents,
      { slNo: String(documents.length + 1), documentType: "", validProof: "" },
    ]);
  const removeDocument = (idx) =>
    documents.length > 1 && setDocuments(documents.filter((_, i) => i !== idx));
  const handleDocumentChange = (idx, field, value) =>
    setDocuments(
      documents.map((doc, i) => (i === idx ? { ...doc, [field]: value } : doc)),
    );

  const handleContactChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  const saveData = (publishStatus) => {
    const services = getServices();
    const idx = services.findIndex(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (idx !== -1) {
      const serviceToUpdate = {
        ...services[idx],
        serviceName,
        processSteps,
        docServiceName,
        documents,
        contact,
        serviceDetails,
        processNew,
        processUpdate,
        processLost,
        processSurrender,
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

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Add Process</CardTitle>
              <CardDescription>
                Define the process steps for this certificate service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Service Name</Label>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter service name"
              />
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Steps</h3>
                {processSteps.map((step, idx) => (
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
                    {processSteps.length > 1 && (
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
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Add Supportive Document</CardTitle>
              <CardDescription>
                List required documents for this certificate service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Service Name</Label>
              <Input
                value={docServiceName}
                onChange={(e) => setDocServiceName(e.target.value)}
                placeholder="Enter service name"
              />
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Documents</h3>
                {documents.map((doc, idx) => (
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
                    {documents.length > 1 && (
                      <Button type="button" onClick={() => removeDocument(idx)}>
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addDocument}>
                  + Add Document
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Add Contact Person</CardTitle>
              <CardDescription>
                Provide contact details for this certificate service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Service Name</Label>
              <Input
                name="serviceName"
                value={contact.serviceName}
                onChange={handleContactChange}
                placeholder="Enter service name"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="district"
                  value={contact.district}
                  onChange={handleContactChange}
                  placeholder="District"
                />
                <Input
                  name="subDistrict"
                  value={contact.subDistrict}
                  onChange={handleContactChange}
                  placeholder="Sub District"
                />
                <Input
                  name="block"
                  value={contact.block}
                  onChange={handleContactChange}
                  placeholder="Block"
                />
                <Input
                  name="name"
                  value={contact.name}
                  onChange={handleContactChange}
                  placeholder="Contact Person's Name"
                />
                <Input
                  name="designation"
                  value={contact.designation}
                  onChange={handleContactChange}
                  placeholder="Designation"
                />
                <Input
                  name="contact"
                  value={contact.contact}
                  onChange={handleContactChange}
                  placeholder="Contact Number"
                />
                <Input
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  placeholder="Email Address"
                />
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Publish Service Detail</CardTitle>
              <CardDescription>
                Finalize and publish this certificate service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label>Service Details</Label>
              <Textarea
                value={serviceDetails}
                onChange={(e) => setServiceDetails(e.target.value)}
                placeholder="Enter service details"
              />
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Deactive">Deactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Process - New</Label>
                  <Textarea
                    value={processNew}
                    onChange={(e) => setProcessNew(e.target.value)}
                    placeholder="Enter new process details"
                  />
                </div>
                <div>
                  <Label>Process - Update</Label>
                  <Textarea
                    value={processUpdate}
                    onChange={(e) => setProcessUpdate(e.target.value)}
                    placeholder="Enter update process details"
                  />
                </div>
                <div>
                  <Label>Process - Lost</Label>
                  <Textarea
                    value={processLost}
                    onChange={(e) => setProcessLost(e.target.value)}
                    placeholder="Enter lost process details"
                  />
                </div>
                <div>
                  <Label>Process - Surrender</Label>
                  <Textarea
                    value={processSurrender}
                    onChange={(e) => setProcessSurrender(e.target.value)}
                    placeholder="Enter surrender process details"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Edit Certificate Service: {decodeURIComponent(name || "")}
        </h1>
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>1</div>
              <div className={`h-1 w-16 ${step > 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>2</div>
              <div className={`h-1 w-16 ${step > 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>3</div>
              <div className={`h-1 w-16 ${step > 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>4</div>
          </div>
          <form onSubmit={handlePublish} className="space-y-8">
            {renderStep()}
            <div className="flex justify-between mt-8">
              <div>
                <Button
                  type="button"
                  onClick={handleSaveForLater}
                  className="bg-gray-500 text-white"
                >
                  Save for Later
                </Button>
              </div>
              <div className="flex gap-4">
                {step > 1 && (
                  <Button type="button" onClick={prevStep}>
                    Back
                  </Button>
                )}
                {step < 4 && (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                )}
                {step === 4 && (
                  <Button type="submit" className="bg-green-600 text-white">
                    Publish
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}