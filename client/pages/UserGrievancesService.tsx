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
import { Badge } from "@/components/ui/badge";
import { ServicesMenu } from "@/components/ui/sidebar";
import { Search } from "lucide-react";

const dummyGrievances = [
  { id: 1, subject: "Water Issue", status: "Pending" },
  { id: 2, subject: "Road Repair", status: "Resolved" },
  { id: 3, subject: "Electricity", status: "In Progress" },
];

export default function UserGrievancesService() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const stats = {
    published: 156,
    active: 23,
    total: 179,
  };
  const filteredGrievances = dummyGrievances.filter((g) =>
    g.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen">
      <ServicesMenu />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Grievances Service</h1>
          <p className="text-gray-600 mb-8">
            Track and submit your grievances.
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
                placeholder="Search grievances..."
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
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="inprogress">In Progress</option>
            </select>
          </div>

          {/* Grievances Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrievances.map((g) => (
              <Card
                key={g.id}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle>{g.subject}</CardTitle>
                  <CardDescription>
                    Status:{" "}
                    <Badge
                      variant={
                        g.status === "Resolved" ? "default" : "secondary"
                      }
                    >
                      {g.status}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">View</Button>
                </CardContent>
              </Card>
            ))}
            {filteredGrievances.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No grievances found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
