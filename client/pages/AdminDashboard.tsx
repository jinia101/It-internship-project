import { useState, useEffect } from "react";
import {
  getServices,
  updateService,
  deleteService,
} from "../lib/localStorageUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Activity,
  Users,
} from "lucide-react";
import AdminSidebar from "@/components/ui/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {children}
      </div>
    </div>
  );
}

export function DashboardHome() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setServices(getServices());
  }, []);

  const approveService = (id: string) => {
    const serviceToApprove = getServices().find((s) => s.id === id);
    if (serviceToApprove) {
      updateService({ ...serviceToApprove, status: "published" });
      setServices(getServices());
    }
  };

  const handleDelete = (id: string) => {
    deleteService(id);
    setServices(getServices());
  };

  const pendingServices = services.filter((s: any) => s.status === "pending");
  const publishedServices = services.filter(
    (s: any) => s.status === "published",
  );

  const stats = {
    published: publishedServices.length,
    active: 0, // Update if you have an 'active' field
    total: services.length,
    pending: pendingServices.length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
        <p className="text-gray-600">
          Manage services, review submissions, and monitor platform performance
        </p>
      </div>

      {/* Stats Cards */}
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
            <p className="text-xs text-muted-foreground">+0% from last month</p>
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
            <p className="text-xs text-muted-foreground">Currently in use</p>
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
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
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
            <p className="text-xs text-muted-foreground">All services</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Pending Services</h2>
        <div className="space-y-4">
          {pendingServices.length === 0 && (
            <div className="text-gray-500">No pending services.</div>
          )}
          {pendingServices.map((service: any) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium">{service.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  {service.category && (
                    <Badge variant="outline">{service.category}</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Review
                </Button>
                <Button size="sm" onClick={() => approveService(service.id)}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Published Services */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Published Services</h2>
        <div className="space-y-4">
          {publishedServices.length === 0 && (
            <div className="text-gray-500">No published services.</div>
          )}
          {publishedServices.map((service: any) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium">{service.name}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  {service.category && (
                    <Badge variant="outline">{service.category}</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
