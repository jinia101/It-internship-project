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
import { CheckCircle, Activity, Clock, Users } from "lucide-react";
import { useState } from "react";

const initialNewFeedbacks = [
  {
    id: 1,
    user: "John Doe",
    date: "2024-07-20",
    message: "Great service, but could be faster.",
  },
  {
    id: 2,
    user: "Jane Smith",
    date: "2024-07-19",
    message: "Had trouble with the application form.",
  },
];
const initialOldFeedbacks = [
  {
    id: 3,
    user: "Alice Brown",
    date: "2024-07-15",
    message: "Resolved: Thanks for fixing my issue!",
  },
];

export default function AdminFeedbackService() {
  const [activeTab, setActiveTab] = useState("new");
  const [newFeedbacks, setNewFeedbacks] = useState(initialNewFeedbacks);
  const [oldFeedbacks, setOldFeedbacks] = useState(initialOldFeedbacks);
  const stats = {
    published: 156,
    active: 23,
    total: 179,
    users: 1234,
    pending: 2,
  };

  const handleResolve = (id: number) => {
    const feedback = newFeedbacks.find((f) => f.id === id);
    if (feedback) {
      setNewFeedbacks(newFeedbacks.filter((f) => f.id !== id));
      setOldFeedbacks([
        { ...feedback, message: "Resolved: " + feedback.message },
        ...oldFeedbacks,
      ]);
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Feedback Service</h1>
          <p className="text-gray-600 mb-8">
            Manage and review all feedbacks submitted by users.
          </p>
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published Services
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
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
                <Activity className="h-4 w-4 text-blue-600" />
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
                  Pending Services
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pending}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.users}
                </div>
                <p className="text-xs text-muted-foreground">
                  Users who saw service details
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="new" className="flex items-center gap-2">
                New Feedbacks
              </TabsTrigger>
              <TabsTrigger value="old" className="flex items-center gap-2">
                Old Feedbacks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="space-y-6">
              {newFeedbacks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No new feedbacks.
                  </CardContent>
                </Card>
              ) : (
                newFeedbacks.map((fb) => (
                  <Card
                    key={fb.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {fb.user}
                      </CardTitle>
                      <CardDescription>{fb.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">{fb.message}</div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => handleResolve(fb.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Resolved
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            <TabsContent value="old" className="space-y-6">
              {oldFeedbacks.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No old feedbacks.
                  </CardContent>
                </Card>
              ) : (
                oldFeedbacks.map((fb) => (
                  <Card
                    key={fb.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {fb.user}
                      </CardTitle>
                      <CardDescription>{fb.date}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">{fb.message}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
