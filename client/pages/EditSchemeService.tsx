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
  const [process, setProcess] = useState([""]);
  const [contacts, setContacts] = useState([
    {
      serviceName: "",
      district: "",
      subDistrict: "",
      block: "",
      name: "",
      designation: "",
      contact: "",
      email: "",
    },
  ]);

  useEffect(() => {
    const scheme = getServiceByName(decodeURIComponent(name || ""));
    if (scheme) {
      if (scheme.eligibilityDetails) setEligibility(scheme.eligibilityDetails);
      if (scheme.schemeDetails) setSchemeDetails(scheme.schemeDetails);
      if (scheme.processDetails) setProcess(scheme.processDetails);
      if (scheme.contacts) {
        setContacts(scheme.contacts);
      }
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
        processDetails: process,
        contacts: contacts,
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

  const handleContactChange = (idx, e) => {
    const { name, value } = e.target;
    setContacts(contacts.map((contact, i) =>
      i === idx ? { ...contact, [name]: value } : contact
    ));
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        serviceName: "",
        district: "",
        subDistrict: "",
        block: "",
        name: "",
        designation: "",
        contact: "",
        email: "",
      },
    ]);
  };

  const removeContact = (idx) => {
    setContacts(contacts.filter((_, i) => i !== idx));
  };

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
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Add Contact Person</CardTitle>
              <CardDescription>
                Provide contact details for this scheme service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contacts.map((contact, idx) => (
                <div key={idx} className="space-y-4 border p-4 rounded-md">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="district"
                      value={contact.district}
                      onChange={(e) => handleContactChange(idx, e)}
                      placeholder="District"
                    />
                    <Input
                      name="subDistrict"
                      value={contact.subDistrict}
                      onChange={(e) => handleContactChange(idx, e)}
                      placeholder="Sub District"
                    />
                    <Input
                      name="block"
                      value={contact.block}
                      onChange={(e) => handleContactChange(idx, e)}
                      placeholder="Block"
                    />
                    <Input
                      name="name"
                      value={contact.name}
                      onChange={(e) => handleContactChange(idx, e)}
                      placeholder="Contact Person's Name"
                    />
                    <Input
                      name="designation"
                      value={contact.designation}
                      onChange={(e) => handleContactChange(idx, e)}
                      placeholder="Designation"
                    />
                    <Input
                      name="contact"
                      value={contact.contact}
                      onChange={(e) => handleContactChange(idx, e)}
                      placeholder="Contact Number"
                    />
                    <Input
                      name="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(idx, e)}
                      placeholder="Email Address"
                    />
                  </div>
                  {contacts.length > 1 && (
                    <Button type="button" onClick={() => removeContact(idx)}>
                      - Remove Contact
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" onClick={addContact}>
                + Add Contact
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
              <div className={`px-4 py-2 rounded-md flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Process</div>
              <div className={`h-1 w-16 mt-2 ${step > 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`px-4 py-2 rounded-md flex items-center justify-center ${step >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>Contact Service</div>
              <div className={`h-1 w-16 mt-2 ${step > 4 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>
          <form onSubmit={handlePublish} className="space-y-8">
            {renderStep()}
            <div className="flex justify-between mt-8">
              
              <div className="flex gap-4">
                {step > 1 && (
                  <Button type="button" onClick={prevStep}>
                    Back
                  </Button>
                )}
                {step < 4 && (
                  <Button type="button" onClick={nextStep}>
                    Save and Next
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