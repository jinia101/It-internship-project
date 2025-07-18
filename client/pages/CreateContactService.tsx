import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Eye,
  Upload,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { saveService } from "../lib/localStorageUtils";

export default function CreateContactService() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    applicationMode: "",
    eligibility: "",
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

  const [processSteps, setProcessSteps] = useState([{ slNo: "", stepDetails: "" }]);
  const [documents, setDocuments] = useState([
    { slNo: "", documentType: "", validProof: "" },
  ]);

  const handleAddProcessStep = () => {
    setProcessSteps([...processSteps, { slNo: "", stepDetails: "" }]);
  };

  const handleRemoveLastProcessStep = () => {
    setProcessSteps(processSteps.slice(0, -1));
  };

  const handleProcessStepChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newProcessSteps = [...processSteps];
    newProcessSteps[index] = { ...newProcessSteps[index], [field]: value };
    setProcessSteps(newProcessSteps);
  };

  const handleAddDocument = () => {
    setDocuments([...documents, { slNo: "", documentType: "", validProof: "" }]);
  };

  const handleRemoveLastDocument = () => {
    setDocuments(documents.slice(0, -1));
  };

  const handleDocumentChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newDocuments = [...documents];
    newDocuments[index] = { ...newDocuments[index], [field]: value };
    setDocuments(newDocuments);
  };

  

  const categories = [
    "Research",
    "Documentation",
    "Design",
    "Analytics",
    "Legal",
    "Marketing",
    "Technology",
    "Finance",
    "Consulting",
    "Education",
  ];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      saveService({
        name: formData.name,
        summary: formData.summary,
        applicationMode: formData.applicationMode,
        eligibility: formData.eligibility,
        tags,
        status: "pending",
      });
      toast({
        title: "Service Created Successfully!",
        description: "Your new service has been added to the platform as pending.",
      });
      setIsSubmitting(false);
      navigate("/contact-service");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    saveService({
      name: formData.name,
      summary: formData.summary,
      applicationMode: formData.applicationMode,
      eligibility: formData.eligibility,
      tags,
      status: "pending",
    });
    toast({
      title: "Draft Saved",
      description: "Your service draft has been saved for later.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/contact-service">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Contact Service
                </Link>
              </Button>
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Create New Contact Service</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your contact service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter service name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Service Summary *</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Short summary of the service"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="applicationMode">Application Mode *</Label>
                  <Select
                    value={formData.applicationMode}
                    onValueChange={(value) =>
                      handleSelectChange("applicationMode", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility">Eligibility *</Label>
                  <Textarea
                    id="eligibility"
                    name="eligibility"
                    value={formData.eligibility}
                    onChange={handleInputChange}
                    placeholder="Who is eligible for this service?"
                    rows={1}
                    className="min-h-[40px] max-h-[60px] resize-none"
                    required
                  />
                </div>
              </div>
              {/* Conditionally show URL/Address fields based on Application Mode */}
              {(formData.applicationMode === "Online" ||
                formData.applicationMode === "Both") && (
                <div className="space-y-2">
                  <Label htmlFor="onlineUrl">Online Service URL</Label>
                  <Input
                    id="onlineUrl"
                    name="onlineUrl"
                    value={formData.onlineUrl}
                    onChange={handleInputChange}
                    placeholder="Enter the online service URL"
                  />
                </div>
              )}
              {(formData.applicationMode === "Offline" ||
                formData.applicationMode === "Both") && (
                <div className="space-y-2">
                  <Label htmlFor="offlineAddress">
                    Offline Service Address
                  </Label>
                  <Input
                    id="offlineAddress"
                    name="offlineAddress"
                    value={formData.offlineAddress}
                    onChange={handleInputChange}
                    placeholder="Enter the offline service address"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Process */}
          <Card>
            <CardHeader>
              <CardTitle>Add Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="processServiceName">Service Name</Label>
                <Input
                  id="processServiceName"
                  name="processServiceName"
                  placeholder="Enter service name"
                />
              </div>
              <div className="pt-4">
                <h3 className="font-semibold text-lg mb-2">Steps</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full p-2 h-8 w-8 flex items-center justify-center"
                    onClick={handleAddProcessStep}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  {processSteps.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full p-2 h-8 w-8 flex items-center justify-center"
                      onClick={handleRemoveLastProcessStep}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  )}
                </div>
                {processSteps.map((step, idx) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4"
                    key={idx}
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`processSlNo-${idx}`}>Sl. No.</Label>
                      <Input
                        id={`processSlNo-${idx}`}
                        name={`processSlNo-${idx}`}
                        placeholder="1"
                        value={step.slNo}
                        onChange={(e) =>
                          handleProcessStepChange(idx, "slNo", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`processStepDetails-${idx}`}>
                        Step Details
                      </Label>
                      <Input
                        id={`processStepDetails-${idx}`}
                        name={`processStepDetails-${idx}`}
                        placeholder="Enter step details"
                        value={step.stepDetails}
                        onChange={(e) =>
                          handleProcessStepChange(
                            idx,
                            "stepDetails",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Supportive Document */}
          <Card>
            <CardHeader>
              <CardTitle>Add Supportive Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supportServiceName">Service Name</Label>
                <Input
                  id="supportServiceName"
                  name="supportServiceName"
                  placeholder="Enter service name"
                />
              </div>
              <div className="pt-4">
                <h3 className="font-semibold text-lg mb-2">Documents</h3>
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full p-2 h-8 w-8 flex items-center justify-center"
                    onClick={handleAddDocument}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  {documents.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full p-2 h-8 w-8 flex items-center justify-center"
                      onClick={handleRemoveLastDocument}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  )}
                </div>
                {documents.map((doc, idx) => (
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4"
                    key={idx}
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`slNo-${idx}`}>Sl. No.</Label>
                      <Input
                        id={`slNo-${idx}`}
                        name={`slNo-${idx}`}
                        placeholder="1"
                        value={doc.slNo}
                        onChange={(e) =>
                          handleDocumentChange(idx, "slNo", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`documentType-${idx}`}>
                        Document Type
                      </Label>
                      <Input
                        id={`documentType-${idx}`}
                        name={`documentType-${idx}`}
                        placeholder="Enter document type"
                        value={doc.documentType}
                        onChange={(e) =>
                          handleDocumentChange(
                            idx,
                            "documentType",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`validProof-${idx}`}>Valid Proof</Label>
                      <Input
                        id={`validProof-${idx}`}
                        name={`validProof-${idx}`}
                        placeholder="Enter valid proof"
                        value={doc.validProof}
                        onChange={(e) =>
                          handleDocumentChange(
                            idx,
                            "validProof",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Contact Person */}
          <Card>
            <CardHeader>
              <CardTitle>Add Contact Person</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactServiceName">Service Name</Label>
                  <Input
                    id="contactServiceName"
                    name="contactServiceName"
                    placeholder="Enter service name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    placeholder="Enter district"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subDistrict">Sub District</Label>
                  <Input
                    id="subDistrict"
                    name="subDistrict"
                    placeholder="Enter sub district"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block">Block</Label>
                  <Input
                    id="block"
                    name="block"
                    placeholder="Enter block name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Name</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    placeholder="Enter contact person's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    name="designation"
                    placeholder="Enter designation"
                  />
                </div>
              </div>
              <div className="pt-4">
                <h3 className="font-semibold text-lg mb-2">Official Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publish Service Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Service Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serviceDetails">Service Details</Label>
                <Textarea
                  id="serviceDetails"
                  name="serviceDetails"
                  placeholder="Enter service details"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      defaultChecked
                      className="accent-blue-600"
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="deactive"
                      className="accent-blue-600"
                    />
                    Deactive
                  </label>
                </div>
              </div>
              <div className="pt-4">
                <h3 className="font-semibold text-lg mb-2">Process</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="processNew">New</Label>
                    <Textarea
                      id="processNew"
                      name="processNew"
                      placeholder="Enter new process details"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="processUpdate">Update</Label>
                    <Textarea
                      id="processUpdate"
                      name="processUpdate"
                      placeholder="Enter update process details"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="processLost">Lost</Label>
                    <Textarea
                      id="processLost"
                      name="processLost"
                      placeholder="Enter lost process details"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="processSurrender">Surrender</Label>
                    <Textarea
                      id="processSurrender"
                      name="processSurrender"
                      placeholder="Enter surrender process details"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="pt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="docNew">New</Label>
                    <Textarea
                      id="docNew"
                      name="docNew"
                      placeholder="Enter new document details"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="docUpdate">Update</Label>
                    <Textarea
                      id="docUpdate"
                      name="docUpdate"
                      placeholder="Enter update document details"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="docLost">Lost</Label>
                    <Textarea
                      id="docLost"
                      name="docLost"
                      placeholder="Enter lost document details"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="docSurrender">Surrender</Label>
                    <Textarea
                      id="docSurrender"
                      name="docSurrender"
                      placeholder="Enter surrender document details"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/contact-service")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Service
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
