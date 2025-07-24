import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServicesMenu } from "@/components/ui/sidebar";
import { Search } from "lucide-react";
import { getServices } from "../lib/localStorageUtils";

export default function UserSchemeService() {
  const [search, setSearch] = useState("");
  const [modalScheme, setModalScheme] = useState(null);
  const publishedSchemes = getServices().filter(
    (s) => s.status === "published" && s.category === "Scheme",
  );
  const filteredSchemes = publishedSchemes.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );
  const stats = {
    published: publishedSchemes.length,
    active: 0,
    total: publishedSchemes.length,
  };

  return (
    <div className="flex min-h-screen">
      <ServicesMenu />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Schemes</h1>
          <p className="text-gray-600 mb-8">
            Browse available government schemes and view details.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Schemes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.published}
                </div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Schemes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.active}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in use
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Schemes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.total}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="mb-8 flex items-center gap-4">
            <Input
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <Card
                key={scheme.id}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle>{scheme.name}</CardTitle>
                  <CardDescription>{scheme.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setModalScheme(scheme)}
                    className="w-full mt-2 bg-blue-600 text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
            {filteredSchemes.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No schemes found.
              </div>
            )}
          </div>
          {/* Modal for Scheme Details */}
          {modalScheme && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative animate-fade-in overflow-y-auto max-h-[90vh]">
                <button
                  onClick={() => setModalScheme(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{modalScheme.name}</h2>
                <p className="mb-2 text-gray-700">{modalScheme.summary}</p>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Eligibility</h3>
                  <ul className="list-disc pl-6">
                    {modalScheme.eligibilityDetails &&
                      modalScheme.eligibilityDetails.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Scheme Details</h3>
                  <ul className="list-disc pl-6">
                    {modalScheme.schemeDetails &&
                      modalScheme.schemeDetails.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Where to Apply</h3>
                  <ul className="list-disc pl-6">
                    {modalScheme.whereToApply &&
                      modalScheme.whereToApply.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Process</h3>
                  <ul className="list-disc pl-6">
                    {modalScheme.processDetails &&
                      modalScheme.processDetails.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
