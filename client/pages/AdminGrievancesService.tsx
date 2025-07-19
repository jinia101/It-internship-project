import AdminSidebar from "@/components/ui/AdminSidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

const dummyGrievances = [
  {
    id: 1,
    fullName: "John Doe",
    mobile: "9876543210",
    email: "john@example.com",
    address: "123 Main St, Agartala",
    department: "Water Supply",
    district: "Agartala",
    subject: "Water leakage",
    description: "There is a water leakage in my area for the past 3 days.",
    date: "2024-07-20",
    urgency: "High",
    status: "new",
    attachment: null,
  },
  {
    id: 2,
    fullName: "Jane Smith",
    mobile: "9123456789",
    email: "jane@example.com",
    address: "456 Park Ave, Udaipur",
    department: "Electricity",
    district: "Udaipur",
    subject: "Power outage",
    description: "No electricity in our block since last night.",
    date: "2024-07-19",
    urgency: "Emergency",
    status: "pending",
    attachment: null,
  },
  {
    id: 3,
    fullName: "Alice Brown",
    mobile: "9988776655",
    email: "alice@example.com",
    address: "789 Lake Rd, Dharmanagar",
    department: "Sanitation",
    district: "Dharmanagar",
    subject: "Garbage not collected",
    description: "Garbage has not been collected for a week.",
    date: "2024-07-18",
    urgency: "Medium",
    status: "resolved",
    attachment: null,
  },
];

export default function AdminGrievancesService() {
  const [activeTab, setActiveTab] = useState("new");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [grievances, setGrievances] = useState(dummyGrievances);

  const openModal = (grievance: any) => {
    setSelectedGrievance(grievance);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedGrievance(null);
  };
  const moveToPending = (id: number) => {
    setGrievances(
      grievances.map((g) => (g.id === id ? { ...g, status: "pending" } : g)),
    );
    closeModal();
  };
  const moveToResolved = (id: number) => {
    setGrievances(
      grievances.map((g) => (g.id === id ? { ...g, status: "resolved" } : g)),
    );
    closeModal();
  };

  const statusMap = {
    new: "New Grievance",
    pending: "Pending Grievance",
    resolved: "Resolved Grievance",
  };

  const tabGrievances = (status: string) =>
    grievances.filter((g) => g.status === status);

  const newCount = grievances.filter((g) => g.status === "new").length;
  const pendingCount = grievances.filter((g) => g.status === "pending").length;
  const resolvedCount = grievances.filter(
    (g) => g.status === "resolved",
  ).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Grievances Service</h1>
          <p className="text-gray-600 mb-8">
            Manage and review all grievances submitted by users.
          </p>
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Grievances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {newCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unseen or unprocessed
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Grievances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </div>
                <p className="text-xs text-muted-foreground">Saved for later</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Resolved Grievances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {resolvedCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  Marked as resolved
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="new">New Grievance</TabsTrigger>
              <TabsTrigger value="pending">Pending Grievance</TabsTrigger>
              <TabsTrigger value="resolved">Resolved Grievance</TabsTrigger>
            </TabsList>
            {(["new", "pending", "resolved"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6">
                {tabGrievances(tab).length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-gray-500">
                      No {statusMap[tab]}s.
                    </CardContent>
                  </Card>
                ) : (
                  tabGrievances(tab).map((g) => (
                    <Card
                      key={g.id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          {g.subject}
                        </CardTitle>
                        <CardDescription>
                          {g.date} &bull; {g.department} &bull; {g.urgency}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 font-medium">
                          From: {g.fullName} ({g.mobile})
                        </div>
                        <div className="mb-2 text-gray-600">{g.address}</div>
                        <div className="mb-2">
                          {g.description.slice(0, 100)}
                          {g.description.length > 100 ? "..." : ""}
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          onClick={() => openModal(g)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          View Details
                        </Button>
                        {tab === "new" && (
                          <>
                            <Button
                              onClick={() => moveToPending(g.id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                              Save for Later
                            </Button>
                            <Button
                              onClick={() => moveToResolved(g.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Resolved
                            </Button>
                          </>
                        )}
                        {tab === "pending" && (
                          <Button
                            onClick={() => moveToResolved(g.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Resolved
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Modal for View Details */}
          {modalOpen && selectedGrievance && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fade-in">
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Grievance Details</h2>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Full Name:</span>{" "}
                    {selectedGrievance.fullName}
                  </div>
                  <div>
                    <span className="font-semibold">Mobile:</span>{" "}
                    {selectedGrievance.mobile}
                  </div>
                  <div>
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedGrievance.email}
                  </div>
                  <div>
                    <span className="font-semibold">Address:</span>{" "}
                    {selectedGrievance.address}
                  </div>
                  <div>
                    <span className="font-semibold">Department:</span>{" "}
                    {selectedGrievance.department}
                  </div>
                  <div>
                    <span className="font-semibold">District/Block/Area:</span>{" "}
                    {selectedGrievance.district}
                  </div>
                  <div>
                    <span className="font-semibold">Subject:</span>{" "}
                    {selectedGrievance.subject}
                  </div>
                  <div>
                    <span className="font-semibold">Description:</span>{" "}
                    {selectedGrievance.description}
                  </div>
                  <div>
                    <span className="font-semibold">Date of Incident:</span>{" "}
                    {selectedGrievance.date}
                  </div>
                  <div>
                    <span className="font-semibold">Urgency Level:</span>{" "}
                    {selectedGrievance.urgency}
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  {selectedGrievance.status === "new" && (
                    <>
                      <Button
                        onClick={() => moveToPending(selectedGrievance.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Save for Later
                      </Button>
                      <Button
                        onClick={() => moveToResolved(selectedGrievance.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Resolved
                      </Button>
                    </>
                  )}
                  {selectedGrievance.status === "pending" && (
                    <Button
                      onClick={() => moveToResolved(selectedGrievance.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Resolved
                    </Button>
                  )}
                  <Button onClick={closeModal} variant="outline">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
