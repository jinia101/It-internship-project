import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { saveService } from "../lib/localStorageUtils";

export default function CreateEmergencyService() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentType: "",
    departmentSummary: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, departmentType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Save department as a pending service
    saveService({
      name: formData.departmentName,
      category: formData.departmentType,
      summary: formData.departmentSummary,
      status: "pending",
      tags: [],
      applicationMode: "",
      eligibility: "",
      type: "emergency",
    });
    toast({
      title: "Department Created Successfully!",
      description:
        "Your new department has been added to the platform as pending.",
    });
    setIsSubmitting(false);
    navigate("/admin-emergency-service");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Department Details</CardTitle>
              <CardDescription>
                Fill in the details for the new emergency department.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="departmentName">Department Name *</Label>
                <Input
                  id="departmentName"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleInputChange}
                  placeholder="Enter department name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentType">Department Type *</Label>
                <Select
                  value={formData.departmentType}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger id="departmentType">
                    <SelectValue placeholder="Select department type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Fire">Fire</SelectItem>
                    <SelectItem value="Disaster Management">
                      Disaster Management
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="departmentSummary">Department Summary *</Label>
                <Textarea
                  id="departmentSummary"
                  name="departmentSummary"
                  value={formData.departmentSummary}
                  onChange={handleInputChange}
                  placeholder="Enter department summary"
                  required
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-primary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Create Department"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
