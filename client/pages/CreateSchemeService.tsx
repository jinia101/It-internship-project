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

export default function CreateSchemeService() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      applicationMode: "",
      eligibility: "",
    });
    toast({
      title: "Scheme Created Successfully!",
      description: "Your new scheme has been added to the platform as pending.",
    });
    setIsSubmitting(false);
    navigate("/scheme-service");
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
