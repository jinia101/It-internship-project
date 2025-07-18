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

const dummyEmergencies = [
  { id: 1, service: "Police", phone: "100", office: "Central Police Station" },
  { id: 2, service: "Fire Brigade", phone: "101", office: "Main Fire Station" },
  { id: 3, service: "Ambulance", phone: "102", office: "City Hospital" },
];

export default function UserEmergencyService() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const stats = {
    published: 156,
    active: 23,
    total: 179,
  };
  const filteredEmergencies = dummyEmergencies.filter((e) =>
    e.service.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen">
      <ServicesMenu />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Emergency Service</h1>
          <p className="text-gray-600 mb-8">
            Find emergency contact numbers and offices.
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.published}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Services
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
                  Total Services
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

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search emergency services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All Services</option>
              <option value="police">Police</option>
              <option value="fire">Fire Brigade</option>
              <option value="ambulance">Ambulance</option>
            </select>
          </div>

          {/* Emergency Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmergencies.map((e) => (
              <Card
                key={e.id}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle>{e.service}</CardTitle>
                  <CardDescription>Office: {e.office}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Phone:</span>
                    <span>{e.phone}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredEmergencies.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No emergency services found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
