import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getServiceByName } from "../lib/localStorageUtils";

export default function ViewSchemeService() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);

  useEffect(() => {
    const fetchedScheme = getServiceByName(decodeURIComponent(name || ""));
    if (fetchedScheme) {
      setScheme(fetchedScheme);
    } else {
      // Handle case where scheme is not found, e.g., navigate back or show error
      navigate("/admin-scheme-service");
    }
  }, [name, navigate]);

  if (!scheme) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">
          View Scheme: {scheme.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Scheme Name</p>
                  <p className="text-lg font-semibold">{scheme.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Summary</p>
                  <p>{scheme.summary}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p>{scheme.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Target Audience</p>
                  <ul className="list-disc list-inside">
                    {scheme.targetAudience && scheme.targetAudience.map((audience, index) => (
                      <li key={index}>{audience}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Eligibility</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {scheme.eligibilityDetails && scheme.eligibilityDetails.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheme Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {scheme.schemeDetails && scheme.schemeDetails.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  {scheme.processDetails && scheme.processDetails.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Person</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheme.contacts && scheme.contacts.map((contact, idx) => (
                  <div key={idx} className="border p-4 rounded-md space-y-2">
                    <p><strong>Name:</strong> {contact.name}</p>
                    <p><strong>Designation:</strong> {contact.designation}</p>
                    <p><strong>Contact:</strong> {contact.contact}</p>
                    <p><strong>Email:</strong> {contact.email}</p>
                    <p><strong>District:</strong> {contact.district}</p>
                    <p><strong>Sub-District:</strong> {contact.subDistrict}</p>
                    <p><strong>Block:</strong> {contact.block}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
