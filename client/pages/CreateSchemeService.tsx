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
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { saveService } from "../lib/localStorageUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateSchemeService() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    applicationMode: "",
    onlineUrl: "",
    offlineAddress: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    saveService({
      name: formData.name,
      summary: formData.summary,
      status: "pending",
      tags: [],
      applicationMode: formData.applicationMode,
      applicationLocation: formData.applicationLocation,
      applicationMode: formData.applicationMode,
      onlineUrl: formData.onlineUrl,
      offlineAddress: formData.offlineAddress,
      eligibility: "",
      type: "scheme",
    });
    toast({
      title: "Scheme Created Successfully!",
      description: "Your new scheme has been added to the platform as pending.",
    });
    setIsSubmitting(false);
    navigate("/admin-scheme-service");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Fill in the details for the new scheme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Scheme Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter scheme name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Scheme Summary *</Label>
                <Input
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Enter scheme summary"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicationMode">Where to Apply *</Label>
                <Select
                  name="applicationMode"
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "applicationMode", value },
                    } as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.applicationMode === "Online" ||
                formData.applicationMode === "Both") && (
                <div className="space-y-2">
                  <Label htmlFor="onlineUrl">Website URL *</Label>
                  <Input
                    id="onlineUrl"
                    name="onlineUrl"
                    value={formData.onlineUrl}
                    onChange={handleInputChange}
                    placeholder="Enter website URL"
                    required
                  />
                </div>
              )}

              {(formData.applicationMode === "Offline" ||
                formData.applicationMode === "Both") && (
                <div className="space-y-2">
                  <Label htmlFor="offlineAddress">
                    Offline Address *
                  </Label>
                  <Input
                    id="offlineAddress"
                    name="offlineAddress"
                    value={formData.offlineAddress}
                    onChange={handleInputChange}
                    placeholder="Enter offline address"
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-primary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Create Scheme"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
