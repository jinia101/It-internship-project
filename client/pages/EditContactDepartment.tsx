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
import { getServices, updateService, getServiceById } from "../lib/localStorageUtils";

export default function EditContactDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  });

  useEffect(() => {
    const dept = getServiceById(id || "");
    if (dept) {
      setServiceDetails(dept);
      if (dept.offices) setOffices(dept.offices);
    }
  }, [id]);

  const handleNewOfficeChange = (e) => {
    const { name, value } = e.target;
    setNewOffice((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewOfficeSelectChange = (name, value) => {
    setNewOffice((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOffice = () => {
    const updatedOffices = [...offices, { ...newOffice, status: "active" }]; // Default to active
    setOffices(updatedOffices);
    if (serviceDetails) {
      updateService({ ...serviceDetails, offices: updatedOffices });
    }
    setNewOffice({
      officeName: "",
      level: "",
      officePinCode: "",
      district: "",
      block: "",
    });
  };

  const handleToggleOfficeStatus = (index) => {
    const updatedOffices = offices.map((office, i) =>
      i === index
        ? {
            ...office,
            status: office.status === "active" ? "inactive" : "active",
          }
        : office,
    );
    setOffices(updatedOffices);
    if (serviceDetails) {
      updateService({ ...serviceDetails, offices: updatedOffices });
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
            <Button onClick={() => setIsAddOfficeDialogOpen(true)} className="mt-4 w-full">
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
                      <Card key={index} className="flex justify-between items-center p-4">
                        <div>
                          <CardTitle className="text-lg">{office.officeName}</CardTitle>
                          <CardDescription>{office.level} - {office.district}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewOffice(office)}>
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleOfficeStatus(index)}
                          >
                            {office.status === "active" ? "Deactivate" : "Activate"}
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
        <Dialog open={isAddOfficeDialogOpen} onOpenChange={setIsAddOfficeDialogOpen}>
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
                  onValueChange={(value) => handleNewOfficeSelectChange("level", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="state">State</SelectItem>
                    <SelectItem value="district">District</SelectItem>
                    <SelectItem value="sub division">Sub Division</SelectItem>
                    <SelectItem value="nagar panchayat">Nagar Panchayat</SelectItem>
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
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddOffice}>Save Office</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}