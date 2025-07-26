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
import { getServices, updateService, getServiceByName } from "../lib/localStorageUtils";

export default function EditSchemeService() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [eligibility, setEligibility] = useState([""]);
  const [schemeDetails, setSchemeDetails] = useState([""]);
  const [whereToApply, setWhereToApply] = useState([""]);
  const [process, setProcess] = useState([""]);

  useEffect(() => {
    const scheme = getServiceByName(decodeURIComponent(name || ""));
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

  const saveData = (status) => {
    const services = getServices();
    const idx = services.findIndex(
      (s) => s.name === decodeURIComponent(name || ""),
    );
    if (idx !== -1) {
      const serviceToUpdate = {
        ...services[idx],
        eligibilityDetails: eligibility,
        schemeDetails: schemeDetails,
        whereToApply: whereToApply,
        processDetails: process,
      };
      if (status) {
        serviceToUpdate.status = status;
      }
      updateService(serviceToUpdate);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    saveData("published");
    navigate("/admin-scheme-service");
  };

  const handleSaveForLater = () => {
    saveData();
    navigate("/admin-scheme-service");
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
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
        );
      case 2:
        return (
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
        );
      case 3:
        return (
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
        );
      case 4:
        return (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          Edit Scheme: {decodeURIComponent(name || "")}
        </h1>
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <div className={`px-4 py-2 rounded-md flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Eligibility</div>
              <div className={`h-1 w-16 mt-2 ${step > 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`px-4 py-2 rounded-md flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Scheme Details</div>
              <div className={`h-1 w-16 mt-2 ${step > 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`px-4 py-2 rounded-md flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Where to Apply</div>
              <div className={`h-1 w-16 mt-2 ${step > 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`px-4 py-2 rounded-md flex items-center justify-center ${step >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Process</div>
            </div>
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