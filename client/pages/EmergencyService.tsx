import { useState, useEffect } from "react";
import {
  getServices,
  updateService,
  deleteService,
  saveService,
} from "../lib/localStorageUtils";
import AdminLayout from "./AdminDashboard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Activity,
  Users,
} from "lucide-react";
import AdminSidebar from "@/components/ui/AdminSidebar";

export default function EmergencyService() {
  const [activeTab, setActiveTab] = useState("create");
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let loaded = getServices();
    // If there are no pending departments, add two dummy ones
    if (!loaded.some((s) => s.status === "pending" && s.category)) {
      const dummy1 = {
        name: "Disaster Management Department",
        category: "Disaster Management",
        summary: "Handles disaster response and preparedness.",
        status: "pending",
        tags: [],
        applicationMode: "",
        eligibility: "",
      };
      const dummy2 = {
        name: "Healthcare Department",
        category: "Healthcare",
        summary: "Provides emergency medical services.",
        status: "pending",
        tags: [],
        applicationMode: "",
        eligibility: "",
      };
      saveService(dummy1);
      saveService(dummy2);
      loaded = getServices();
    }
    setServices(loaded);
  }, []);

  const approveService = (id: string) => {
    const serviceToApprove = getServices().find((s) => s.id === id);
    if (serviceToApprove) {
      updateService({ ...serviceToApprove, status: "published" });
      setServices(getServices());
    }
  };

  const handleDeleteService = (id: string) => {
    deleteService(id);
    setServices(getServices());
  };

  const pendingServices = services.filter((s: any) => s.status === "pending");
  const publishedServices = services.filter(
    (s: any) => s.status === "published",
  );

  const stats = {
    published: publishedServices.length,
    active: 23, // This will need to be updated based on actual active services
    total: services.length,
    users: 1234, // This will need to be updated based on actual users
    pending: pendingServices.length,
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Emergency Service</h1>
            <p className="text-gray-600">
              Manage and review all emergency services and their details here.
            </p>
          </div>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Service
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Services
              </TabsTrigger>
              <TabsTrigger
                value="published"
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Published Services
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Service
                  </CardTitle>
                  <CardDescription>
                    Add a new emergency service to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Ready to create a new emergency service?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Use our service creation form to add new offerings to the
                      platform
                    </p>
                    <Button size="lg" asChild>
                      <Link to="/admin/create-emergency-service">
                        Create New Service
                        <Plus className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Departments ({pendingServices.length})
                  </CardTitle>
                  <CardDescription>
                    Review and manage submitted emergency departments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingServices.map((service: any) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <Badge variant="outline">{service.category}</Badge>
                          </div>
                          <div className="text-gray-500 text-sm mt-2">
                            {service.summary}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="published" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Published Services ({publishedServices.length})
                  </CardTitle>
                  <CardDescription>
                    Manage your live emergency services and monitor performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {publishedServices.map((service: any) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{service.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>Published {service.publishedDate}</span>
                            <span>•</span>
                            <Badge variant="outline">{service.category}</Badge>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {service.views} views
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {service.orders} orders
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
