import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Search,
  Shield,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  Globe,
  Award,
  Clock,
} from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Search Any Document Requirement",
      description:
        "Quickly find out what documents you need for Aadhaar, PAN, passport, driving license, and more.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Accurate & Up-to-date",
      description:
        "All document checklists and requirements are sourced from official government guidelines.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Step-by-Step Guidance",
      description:
        "Get clear instructions for every process, from new applications to renewals and corrections.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "For Every Indian Citizen",
      description:
        "Whether you’re a student, professional, or senior citizen, find the right info for your needs.",
    },
  ];

  const stats = [
    {
      label: "Active Services",
      value: "500+",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      label: "Happy Clients",
      value: "10K+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Success Rate",
      value: "99%",
      icon: <Award className="h-5 w-5" />,
    },
    {
      label: "Avg Response",
      value: "< 1hr",
      icon: <Clock className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">InfoServices Tripura</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/user-dashboard"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/services"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                About
              </Link>
              <Button asChild>
                <Link to="/admin/login">Admin</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            Tripura's Official Document Guidance Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Find the Documents You Need
            <br />
            For Any Government Service in Tripura
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            InfoServices Tripura helps you understand exactly which documents
            you need to apply for official documents and services in
            Tripura—like Aadhaar, PAN card, driving license, birth certificate,
            and more. Get step-by-step guidance and document checklists for
            every government process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/user-dashboard">
                Explore Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8"
            >
              <Link to="/admin/login">Admin Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Use InfoServices Tripura?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy for every citizen of Tripura to know exactly what
              documents are needed for any official process—no confusion, no
              wasted trips.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg text-primary w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who trust InfoServices for their information
            needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-8"
            >
              <Link to="/user-dashboard">Browse Services</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Link to="/admin/login">Service Provider?</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">InfoServices</span>
              </div>
              <p className="text-gray-400">
                Connecting you with premium information services worldwide.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/user-dashboard"
                    className="hover:text-white transition-colors"
                  >
                    User Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/login"
                    className="hover:text-white transition-colors"
                  >
                    Admin Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-white transition-colors"
                  >
                    All Services
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InfoServices. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
