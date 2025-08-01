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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  getServices,
  updateService,
  getServiceById,
} from "../lib/localStorageUtils";
import { apiClient } from "../../shared/api";
import { toast } from "@/hooks/use-toast";

export default function EditContactDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [offices, setOffices] = useState([]);
  const [isAddOfficeDialogOpen, setIsAddOfficeDialogOpen] = useState(false);
  const [isViewOfficeDialogOpen, setIsViewOfficeDialogOpen] = useState(false);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [newOffice, setNewOffice] = useState({
    officeName: "",
    level: "",
    officePinCode: "",
    district: "",
    block: "",
    subdivision: "",
  });

  useEffect(() => {
    const fetchContactService = async () => {
      console.log("fetchContactService called with id:", id);
      console.log("id type:", typeof id);
      console.log("parsed id:", parseInt(id));

      if (!id) {
        console.log("No ID provided");
        return;
      }

      setLoading(true);
      try {
        // Get all contact services to find by ID
        console.log("Fetching contact services...");
        const response = await apiClient.getContactServices();
        console.log("API response:", response);
        console.log("Looking for service with ID:", id);
        console.log("Available services:", response.contactServices);
        console.log(
          "Available IDs:",
          response.contactServices?.map((s) => `${s.id} (${typeof s.id})`),
        );

        const contactService = response.contactServices?.find(
          (service: any) =>
            service.id === id ||
            service.id === parseInt(id) ||
            service.id.toString() === id,
        );

        console.log("Found contact service:", contactService);

        // If not found in list, try to get individual service by ID
        if (!contactService) {
          try {
            console.log("Trying to get individual service by ID:", id);
            const individualResponse = await apiClient.getContactService(
              parseInt(id),
            );
            console.log("Individual service response:", individualResponse);
            const individualService = individualResponse.contactService;

            if (individualService) {
              console.log(
                "Setting current service from individual call:",
                individualService,
              );
              setCurrentService(individualService);
              setServiceDetails(individualService);
              // Map contacts to office format for display
              if (individualService.contacts) {
                const mappedOffices = individualService.contacts.map(
                  (contact) => ({
                    officeName: contact.name,
                    level: contact.designation,
                    officePinCode: contact.contact,
                    district: contact.district,
                    block: contact.block,
                    subdivision: contact.subDistrict,
                    status: "active",
                  }),
                );
                setOffices(mappedOffices);
                console.log("Mapped offices:", mappedOffices);
              }
              return; // Exit early since we found the service
            }
          } catch (individualError) {
            console.log("Failed to get individual service:", individualError);
          }
        }

        if (contactService) {
          console.log("Setting current service:", contactService);
          setCurrentService(contactService);
          setServiceDetails(contactService);
          // Map contacts to office format for display
          if (contactService.contacts) {
            const mappedOffices = contactService.contacts.map((contact) => ({
              officeName: contact.name,
              level: contact.designation,
              officePinCode: contact.contact,
              district: contact.district,
              block: contact.block,
              subdivision: contact.subDistrict,
              status: "active",
            }));
            setOffices(mappedOffices);
            console.log("Mapped offices:", mappedOffices);
          }
        } else {
          console.log(
            "Service not found, available IDs:",
            response.contactServices?.map((s) => s.id),
          );
          toast({
            title: "Error",
            description: `Contact service not found with ID: ${id}. Available IDs: ${response.contactServices?.map((s) => s.id).join(", ") || "none"}`,
            variant: "destructive",
          });
          navigate("/admin-contact-service");
        }
      } catch (error) {
        console.error("Error fetching contact service:", error);
        toast({
          title: "Error",
          description: "Failed to load contact service",
          variant: "destructive",
        });
        navigate("/admin-contact-service");
      } finally {
        setLoading(false);
      }
    };

    fetchContactService();
  }, [id]);

  const handleNewOfficeChange = (e) => {
    const { name, value } = e.target;
    setNewOffice((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewOfficeSelectChange = (name, value) => {
    setNewOffice((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOffice = async () => {
    console.log("handleAddOffice called");
    console.log("currentService:", currentService);
    console.log("newOffice:", newOffice);

    if (!currentService) {
      console.log("No current service found");
      toast({
        title: "Error",
        description: "No service selected",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!newOffice.officeName || !newOffice.level || !newOffice.district) {
      toast({
        title: "Error",
        description:
          "Please fill in all required fields (Office Name, Level, District)",
        variant: "destructive",
      });
      return;
    }

    const newContact = {
      serviceName: currentService.name,
      name: newOffice.officeName,
      designation: newOffice.level,
      contact: newOffice.officePinCode,
      email: "",
      district: newOffice.district,
      subDistrict: newOffice.subdivision || "",
      block: newOffice.block,
    };

    console.log("newContact to be added:", newContact);

    try {
      // Create update data with all contacts including the new one
      const updatedContacts = [...(currentService.contacts || []), newContact];

      const updateData = {
        name: currentService.name,
        summary: currentService.summary,
        type: currentService.type,
        targetAudience: currentService.targetAudience || [],
        applicationMode: currentService.applicationMode,
        onlineUrl: currentService.onlineUrl,
        offlineAddress: currentService.offlineAddress,
        status: currentService.status,
        eligibilityDetails: currentService.eligibilityDetails || [],
        contactDetails: currentService.contactDetails || [],
        processDetails: currentService.processDetails || [],
        contacts: updatedContacts,
      };

      console.log("Sending update to API:", updateData);
      const response = await apiClient.updateContactService(
        currentService.id,
        updateData,
      );
      console.log("API response:", response);

      // Update the current service state with the response from the server
      const updatedService = response.contactService;
      setCurrentService(updatedService);
      setServiceDetails(updatedService);

      // Update the offices display by mapping the updated contacts
      if (updatedService.contacts) {
        const mappedOffices = updatedService.contacts.map((contact) => ({
          officeName: contact.name,
          level: contact.designation,
          officePinCode: contact.contact,
          district: contact.district,
          block: contact.block,
          subdivision: contact.subDistrict,
          status: "active",
        }));
        setOffices(mappedOffices);
      }

      toast({
        title: "Success",
        description: "Office added successfully",
      });

      // Reset the form
      setNewOffice({
        officeName: "",
        level: "",
        officePinCode: "",
        district: "",
        block: "",
        subdivision: "",
      });
      setIsAddOfficeDialogOpen(false);
    } catch (error) {
      console.error("Error adding office:", error);
      toast({
        title: "Error",
        description: `Failed to add office: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleToggleOfficeStatus = async (index) => {
    if (!currentService) return;

    const updatedOffices = offices.map((office, i) =>
      i === index
        ? {
            ...office,
            status: office.status === "active" ? "inactive" : "active",
          }
        : office,
    );
    setOffices(updatedOffices);

    try {
      const updateData = {
        ...currentService,
        status: updatedOffices[index].status,
      };

      await apiClient.updateContactService(currentService.id, updateData);

      toast({
        title: "Success",
        description: "Office status updated successfully",
      });
    } catch (error) {
      console.error("Error updating office status:", error);
      toast({
        title: "Error",
        description: "Failed to update office status",
        variant: "destructive",
      });
      // Revert the UI change
      setOffices(offices);
    }
  };

  const handleViewOffice = (office) => {
    navigate(`/admin/office-details/${office.officeName}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Edit Department: {serviceDetails?.name || ""}
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Service Details */}
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label className="text-gray-600">Name:</Label>
                  <p className="font-medium">{serviceDetails?.name}</p>
                </div>
                <div className="mb-4">
                  <Label className="text-gray-600">Type:</Label>
                  <p className="font-medium">{serviceDetails?.type}</p>
                </div>
                <div className="mb-4">
                  <Label className="text-gray-600">Summary:</Label>
                  <p className="font-medium">{serviceDetails?.summary}</p>
                </div>
              </CardContent>
            </Card>
            <Button
              onClick={() => setIsAddOfficeDialogOpen(true)}
              className="mt-4 w-full"
            >
              + Add Office
            </Button>
          </div>

          {/* Right Column: Office Management */}
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Offices</CardTitle>
              </CardHeader>
              <CardContent>
                {offices.length === 0 ? (
                  <p className="text-gray-500">No offices added yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {offices.map((office, index) => (
                      <Card
                        key={index}
                        className="flex justify-between items-center p-4"
                      >
                        <div>
                          <CardTitle className="text-lg">
                            {office.officeName}
                          </CardTitle>
                          <CardDescription>
                            {office.level} - {office.district}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewOffice(office)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleOfficeStatus(index)}
                          >
                            {office.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Office Dialog */}
        <Dialog
          open={isAddOfficeDialogOpen}
          onOpenChange={setIsAddOfficeDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Office</DialogTitle>
              <DialogDescription>
                Enter the details for the new office.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="officeName" className="text-right">
                  Office Name
                </Label>
                <Input
                  id="officeName"
                  name="officeName"
                  value={newOffice.officeName}
                  onChange={handleNewOfficeChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">
                  Level
                </Label>
                <Select
                  name="level"
                  value={newOffice.level}
                  onValueChange={(value) =>
                    handleNewOfficeSelectChange("level", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="state">State</SelectItem>
                    <SelectItem value="district">District</SelectItem>
                    <SelectItem value="sub division">Sub Division</SelectItem>
                    <SelectItem value="nagar panchayat">
                      Nagar Panchayat
                    </SelectItem>
                    <SelectItem value="AMC">AMC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="officePinCode" className="text-right">
                  Pincode
                </Label>
                <Input
                  id="officePinCode"
                  name="officePinCode"
                  value={newOffice.officePinCode}
                  onChange={handleNewOfficeChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="district" className="text-right">
                  District
                </Label>
                <Input
                  id="district"
                  name="district"
                  value={newOffice.district}
                  onChange={handleNewOfficeChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="block" className="text-right">
                  Block
                </Label>
                <Input
                  id="block"
                  name="block"
                  value={newOffice.block}
                  onChange={handleNewOfficeChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subdivision" className="text-right">
                  Subdivision
                </Label>
                <Input
                  id="subdivision"
                  name="subdivision"
                  value={newOffice.subdivision}
                  onChange={handleNewOfficeChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  console.log("Save Office button clicked");
                  handleAddOffice();
                }}
              >
                Save Office
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
