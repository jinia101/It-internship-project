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
import { Plus, CheckCircle, Activity, Clock, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiClient } from "../../shared/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export default function AdminContactService() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "create",
  );
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
      return;
    }

    const fetchContactServices = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getContactServices();
        setServices(response.contactServices || []);
      } catch (error) {
        console.error("Error fetching contact services:", error);
        setError("Failed to load contact services");
      } finally {
        setLoading(false);
      }
    };

    fetchContactServices();
  }, [isAuthenticated, navigate]);

  const pendingServices = services.filter((s) => s.status === "draft");
  const publishedServices = services.filter((s) => s.status === "published");

  const stats = {
    published: publishedServices.length,
    active: 0,
    total: services.length,
    users: 0,
    pending: pendingServices.length,
  };

  const handleEdit = (service) => {
    navigate(`/admin/edit-contact-department/${service.id}`);
  };

  const handleView = (service) => {
    navigate(`/admin/view-contact-service/${encodeURIComponent(service.name)}`);
  };

  const handlePublish = async (service) => {
    try {
      const updateData = {
        ...service,
        status: "published",
      };

      await apiClient.updateContactService(service.id, updateData);

      // Refresh the services list
      const response = await apiClient.getContactServices();
      setServices(response.contactServices || []);

      toast({
        title: "Success",
        description: "Contact service published successfully",
      });
    } catch (error) {
      console.error("Error publishing contact service:", error);
      toast({
        title: "Error",
        description: "Failed to publish contact service",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (service) => {
    try {
      await apiClient.deleteContactService(service.id);
      // Refresh the services list
      const response = await apiClient.getContactServices();
      setServices(response.contactServices || []);

      toast({
        title: "Success",
        description: "Contact service deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting contact service:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact service",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">
            Contact Department Service
          </h1>
          <p className="text-gray-600 mb-8">
            Manage and review all contact department services and their details
            here.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="text-lg">Loading contact services...</div>
            </div>
          )}

          {!loading && (
            <>
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
                      Currently active
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
                      Awaiting review
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Services
                    </CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {stats.total}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All services
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <Activity className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.users}
                    </div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="create">Create New</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({stats.pending})
                  </TabsTrigger>
                  <TabsTrigger value="published">
                    Published ({stats.published})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Contact Service</CardTitle>
                      <CardDescription>
                        Add a new contact department service to the system
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild>
                        <Link to="/admin/create-contact-service">
                          <Plus className="h-4 w-4 mr-2" />
                          Create New Service
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pending" className="space-y-6">
                  {pendingServices.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-gray-500">
                          No pending services found.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    pendingServices.map((service) => (
                      <Card
                        key={service.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {service.name}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {service.summary}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(service)}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(service)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handlePublish(service)}
                              >
                                Publish
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <div className="flex justify-between items-center w-full">
                            <p className="text-sm text-gray-500">
                              Status:{" "}
                              <span className="font-medium">
                                {service.status}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Created:{" "}
                              {new Date(service.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="published" className="space-y-6">
                  {publishedServices.length === 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-center text-gray-500">
                          No published services found.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    publishedServices.map((service) => (
                      <Card
                        key={service.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {service.name}
                              </CardTitle>
                              <CardDescription className="mt-2">
                                {service.summary}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(service)}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(service)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(service)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="pt-0">
                          <div className="flex justify-between items-center w-full">
                            <p className="text-sm text-gray-500">
                              Status:{" "}
                              <span className="font-medium text-green-600">
                                {service.status}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Published:{" "}
                              {new Date(service.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
