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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServices, deleteService } from "../lib/localStorageUtils";

export default function AdminCertificateService() {
  const [activeTab, setActiveTab] = useState("create");
  const [certs, setCerts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setCerts(getServices());
  }, []);
  const pendingCerts = certs.filter(
    (s) => s.status === "pending" && s.type === "certificate",
  );
  const publishedCerts = certs.filter(
    (s) => s.status === "published" && s.type === "certificate",
  );
  const stats = {
    published: publishedCerts.length,
    active: 0,
    total: certs.length,
    users: 0,
    pending: pendingCerts.length,
  };
  const handleEdit = (cert) => {
    navigate(
      `/admin/edit-certificate-service/${encodeURIComponent(cert.name)}`,
    );
  };
  const handleView = (cert) => {
    navigate(
      `/admin/edit-certificate-service/${encodeURIComponent(cert.name)}`,
    );
  };
  const handleDelete = (cert) => {
    deleteService(cert.id);
    setCerts(getServices());
  };
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Certificate Service</h1>
          <p className="text-gray-600 mb-8">
            Manage and review all certificate services and their details here.
          </p>
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
                    Add a new certificate service to the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      Ready to create a new certificate service?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Use our service creation form to add new offerings to the
                      platform
                    </p>
                    <Button size="lg" asChild>
                      <Link to="/admin/create-certificate-service">
                        Create New Certificate
                        <Plus className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending" className="space-y-6">
              {pendingCerts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No pending certificates.
                  </CardContent>
                </Card>
              ) : (
                pendingCerts.map((cert) => (
                  <Card
                    key={cert.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {cert.name}
                      </CardTitle>
                      <CardDescription>{cert.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Add more details if needed */}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(cert)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cert)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cert)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </TabsContent>
            <TabsContent value="published" className="space-y-6">
              {publishedCerts.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    No published certificates.
                  </CardContent>
                </Card>
              ) : (
                publishedCerts.map((cert) => (
                  <Card
                    key={cert.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {cert.name}
                      </CardTitle>
                      <CardDescription>{cert.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Add more details if needed */}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(cert)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(cert)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(cert)}
                      >
                        Delete
                      </Button>
                    </CardFooter>
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
