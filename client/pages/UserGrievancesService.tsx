import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServicesMenu } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";

const dummyGrievances = [
  { id: 1, subject: "Water Issue", status: "Pending" },
  { id: 2, subject: "Road Repair", status: "Resolved" },
  { id: 3, subject: "Electricity", status: "In Progress" },
];

const departments = [
  "Electricity",
  "Water Supply",
  "Public Works",
  "Sanitation",
  "Police",
  "Other",
];
const urgencyLevels = ["Low", "Medium", "High", "Emergency"];
const districts = [
  "Agartala",
  "Udaipur",
  "Dharmanagar",
  "Kailashahar",
  "Other",
];

export default function UserGrievancesService() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    department: "",
    district: "",
    subject: "",
    description: "",
    date: "",
    urgency: "",
    attachment: null as File | null,
  });
  const stats = {
    published: 156,
    active: 23,
    total: 179,
  };
  const filteredGrievances = dummyGrievances.filter((g) =>
    g.subject.toLowerCase().includes(search.toLowerCase()),
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    alert("Grievance submitted! (Demo)");
    setForm({
      fullName: "",
      mobile: "",
      email: "",
      address: "",
      department: "",
      district: "",
      subject: "",
      description: "",
      date: "",
      urgency: "",
      attachment: null,
    });
  };

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

          {/* Grievance Form */}
          <Card className="max-w-3xl mx-auto mb-12 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Submit a Grievance</CardTitle>
              <CardDescription>
                Fill out the form below to submit your grievance. Fields marked
                * are required.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">
                      Full Name *
                    </label>
                    <Input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Mobile Number *
                    </label>
                    <Input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleInputChange}
                      required
                      placeholder="10-digit mobile number"
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Email ID</label>
                    <Input
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="Optional email address"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">Address *</label>
                    <Input
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Your address"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">
                      Department Concerned *
                    </label>
                    <select
                      name="department"
                      value={form.department}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dep) => (
                        <option key={dep} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      District / Block / Area *
                    </label>
                    <select
                      name="district"
                      value={form.district}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Area</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">
                      Subject / Title *
                    </label>
                    <Input
                      name="subject"
                      value={form.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Short summary of grievance"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Date of Incident *
                    </label>
                    <Input
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      required
                      type="date"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Grievance Description *
                  </label>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe your grievance (up to 500 words)"
                    rows={5}
                    maxLength={500}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-1">
                      Urgency Level *
                    </label>
                    <select
                      name="urgency"
                      value={form.urgency}
                      onChange={handleInputChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Urgency</option>
                      {urgencyLevels.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Attachments (Optional)
                    </label>
                    <Input
                      name="attachment"
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" size="lg" className="w-full">
                  Submit Grievance
                </Button>
              </CardFooter>
            </form>
          </Card>

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
