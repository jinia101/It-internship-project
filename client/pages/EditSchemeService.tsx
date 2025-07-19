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
import { getServices, updateService } from "../lib/localStorageUtils";

export default function EditSchemeService() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [eligibility, setEligibility] = useState([""]);
  const [schemeDetails, setSchemeDetails] = useState([""]);
  const [whereToApply, setWhereToApply] = useState([""]);
  const [process, setProcess] = useState([""]);

  useEffect(() => {
    const services = getServices();
    const scheme = services.find(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (scheme) {
      if (scheme.eligibilityDetails) setEligibility(scheme.eligibilityDetails);
      if (scheme.schemeDetails) setSchemeDetails(scheme.schemeDetails);
      if (scheme.whereToApply) setWhereToApply(scheme.whereToApply);
      if (scheme.processDetails) setProcess(scheme.processDetails);
    }
  }, [name]);

  const handleAdd = (setter, arr) => setter([...arr, ""]);
  const handleChange = (setter, arr, idx, value) =>
    setter(arr.map((v, i) => (i === idx ? value : v)));
  const handleRemove = (setter, arr, idx) =>
    setter(arr.filter((_, i) => i !== idx));

  const handlePublish = (e) => {
    e.preventDefault();
    const services = getServices();
    const idx = services.findIndex(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (idx !== -1) {
      services[idx].status = "published";
      services[idx].eligibilityDetails = eligibility;
      services[idx].schemeDetails = schemeDetails;
      services[idx].whereToApply = whereToApply;
      services[idx].processDetails = process;
      updateService(services[idx]);
    }
    navigate("/admin-scheme-service");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Edit Scheme: {decodeURIComponent(name || "")}
        </h1>
        <form onSubmit={handlePublish} className="max-w-2xl mx-auto space-y-8">
          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility</CardTitle>
              <CardDescription>
                Add eligibility requirements for this scheme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eligibility.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleChange(
                        setEligibility,
                        eligibility,
                        idx,
                        e.target.value,
                      )
                    }
                    placeholder="Enter eligibility requirement"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      handleRemove(setEligibility, eligibility, idx)
                    }
                    disabled={eligibility.length === 1}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAdd(setEligibility, eligibility)}
              >
                + Add Eligibility
              </Button>
            </CardContent>
          </Card>
          {/* Scheme Details */}
          <Card>
            <CardHeader>
              <CardTitle>Scheme Details</CardTitle>
              <CardDescription>Add details about the scheme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {schemeDetails.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Textarea
                    value={item}
                    onChange={(e) =>
                      handleChange(
                        setSchemeDetails,
                        schemeDetails,
                        idx,
                        e.target.value,
                      )
                    }
                    placeholder="Enter scheme detail"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      handleRemove(setSchemeDetails, schemeDetails, idx)
                    }
                    disabled={schemeDetails.length === 1}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAdd(setSchemeDetails, schemeDetails)}
              >
                + Add Detail
              </Button>
            </CardContent>
          </Card>
          {/* Where to Apply */}
          <Card>
            <CardHeader>
              <CardTitle>Where to Apply</CardTitle>
              <CardDescription>
                Add application locations or methods.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {whereToApply.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleChange(
                        setWhereToApply,
                        whereToApply,
                        idx,
                        e.target.value,
                      )
                    }
                    placeholder="Enter location or method"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      handleRemove(setWhereToApply, whereToApply, idx)
                    }
                    disabled={whereToApply.length === 1}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAdd(setWhereToApply, whereToApply)}
              >
                + Add Location/Method
              </Button>
            </CardContent>
          </Card>
          {/* Process */}
          <Card>
            <CardHeader>
              <CardTitle>Process</CardTitle>
              <CardDescription>
                Add process steps for this scheme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Textarea
                    value={item}
                    onChange={(e) =>
                      handleChange(setProcess, process, idx, e.target.value)
                    }
                    placeholder="Enter process step"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemove(setProcess, process, idx)}
                    disabled={process.length === 1}
                  >
                    -
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => handleAdd(setProcess, process)}
              >
                + Add Step
              </Button>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-600 text-white">
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
