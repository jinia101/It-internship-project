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
  const [processSteps, setProcessSteps] = useState([
    { slNo: "1", stepDetails: "" },
  ]);
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
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [processType, setProcessType] = useState<string>('New Application');

  useEffect(() => {
    const cert = getServiceByName(decodeURIComponent(name || ""));
    if (cert) {
      setServiceData({
        name: cert.name || "",
        certificateAbbreviation: cert.certificateAbbreviation || "",
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
        onlineUrl: cert.onlineUrl || "",
        offlineAddress: cert.offlineAddress || "",
      });
      setProcessSteps(cert.processSteps || [{ slNo: "1", stepDetails: "" }]);
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

  const addEligibility = () => {
    setServiceData((prev) => ({
      ...prev,
      eligibility: [...prev.eligibility, ""],
    }));
  };

  const removeEligibility = (idx: number) => {
    setServiceData((prev) => ({
      ...prev,
      eligibility: prev.eligibility.filter((_, i) => i !== idx),
    }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
              <CardDescription>Overview of the certificate service.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold">Certificate Name:</Label>
                <p>{serviceData.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Certificate Abbreviation:</Label>
                <p>{serviceData.certificateAbbreviation}</p>
              </div>
              <div>
                <Label className="font-semibold">Summary:</Label>
                <p>{serviceData.summary}</p>
              </div>
              <div>
                <Label className="font-semibold">Application Mode:</Label>
                <p>{serviceData.applicationMode}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-4">
            <Button onClick={() => setActiveForm('process')}>Add Process</Button>
            <Button onClick={() => setActiveForm('documents')}>Add Documents</Button>
            <Button onClick={() => setActiveForm('eligibility')}>Add Eligibility</Button>
            <Button onClick={() => setActiveForm('contact')}>Add Contact Person</Button>
            <Button variant="outline">Preview</Button>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2">
          {activeForm === 'process' && (
            <Card>
              <CardHeader>
                <CardTitle>Add Process Steps</CardTitle>
                <CardDescription>Define the process for each application type.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={processType === 'New Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('New Application')}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={processType === 'Lost Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Lost Application')}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={processType === 'Update Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Update Application')}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={processType === 'Surrender Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Surrender Application')}
                  >
                    Surrender Application
                  </Button>
                </div>

                <h3 className="font-semibold mb-2">Steps for {processType}</h3>
                {processSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={step.slNo}
                      onChange={(e) => handleProcessStepChange(idx, "slNo", e.target.value)}
                      placeholder="Sl. No."
                      className="w-20"
                    />
                    <Input
                      value={step.stepDetails}
                      onChange={(e) => handleProcessStepChange(idx, "stepDetails", e.target.value)}
                      placeholder="Enter step details"
                    />
                    {processSteps.length > 1 && (
                      <Button type="button" onClick={() => removeProcessStep(idx)}>
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addProcessStep}>
                  + Add Step
                </Button>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button type="button" onClick={() => setActiveForm(null)} variant="outline">
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => console.log('Save Process')}>
                    Save Process
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeForm === 'documents' && (
            <Card>
              <CardHeader>
                <CardTitle>Add Supportive Documents</CardTitle>
                <CardDescription>List required documents for this certificate service.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={processType === 'New Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('New Application')}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={processType === 'Lost Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Lost Application')}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={processType === 'Update Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Update Application')}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={processType === 'Surrender Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Surrender Application')}
                  >
                    Surrender Application
                  </Button>
                </div>
                <h3 className="font-semibold mb-2">Documents for {processType}</h3>
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={doc.slNo}
                      onChange={(e) => handleDocumentChange(idx, "slNo", e.target.value)}
                      placeholder="Sl. No."
                      className="w-20"
                    />
                    <Input
                      value={doc.documentType}
                      onChange={(e) => handleDocumentChange(idx, "documentType", e.target.value)}
                      placeholder="Enter document type"
                    />
                    <Input
                      value={doc.validProof}
                      onChange={(e) => handleDocumentChange(idx, "validProof", e.target.value)}
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
                <div className="flex justify-end space-x-4 mt-4">
                  <Button type="button" onClick={() => setActiveForm(null)} variant="outline">
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => console.log('Save Documents')}>
                    Save Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeForm === 'eligibility' && (
            <Card>
              <CardHeader>
                <CardTitle>Add Eligibility Criteria</CardTitle>
                <CardDescription>Define who is eligible for this service.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={processType === 'New Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('New Application')}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={processType === 'Lost Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Lost Application')}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={processType === 'Update Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Update Application')}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={processType === 'Surrender Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Surrender Application')}
                  >
                    Surrender Application
                  </Button>
                </div>
                <h3 className="font-semibold mb-2">Eligibility for {processType}</h3>
                {serviceData.eligibility.map((eligibility, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input
                      value={eligibility}
                      onChange={(e) => {
                        const newEligibility = [...serviceData.eligibility];
                        newEligibility[idx] = e.target.value;
                        setServiceData(prev => ({ ...prev, eligibility: newEligibility }));
                      }}
                      placeholder="Enter eligibility criteria"
                      className="flex-grow min-h-[40px] max-h-[60px] resize-none"
                    />
                    {serviceData.eligibility.length > 1 && (
                      <Button type="button" onClick={() => removeEligibility(idx)}>
                        -
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={addEligibility}>
                  + Add Eligibility
                </Button>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button type="button" onClick={() => setActiveForm(null)} variant="outline">
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => console.log('Save Eligibility')}>
                    Save Eligibility
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeForm === 'contact' && (
            <Card>
              <CardHeader>
                <CardTitle>Add Contact Person</CardTitle>
                <CardDescription>Provide contact details for this certificate service.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <Button
                    variant={processType === 'New Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('New Application')}
                  >
                    New Application
                  </Button>
                  <Button
                    variant={processType === 'Lost Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Lost Application')}
                  >
                    Lost Application
                  </Button>
                  <Button
                    variant={processType === 'Update Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Update Application')}
                  >
                    Update Application
                  </Button>
                  <Button
                    variant={processType === 'Surrender Application' ? 'default' : 'outline'}
                    onClick={() => setProcessType('Surrender Application')}
                  >
                    Surrender Application
                  </Button>
                </div>
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
                <div className="flex justify-end space-x-4 mt-4">
                  <Button type="button" onClick={() => setActiveForm(null)} variant="outline">
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => console.log('Save Contact')}>
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