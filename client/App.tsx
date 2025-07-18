import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ServiceDetails from "./pages/ServiceDetails";
import AdminProfile from "./pages/AdminProfile";
import AdminLogin from "./pages/AdminLogin";
import SchemeService from "./pages/SchemeService";
import ContactService from "./pages/ContactService";
import GrievancesService from "./pages/GrievancesService";
import EmergencyService from "./pages/EmergencyService";
import FeedbackService from "./pages/FeedbackService";
import CertificateService from "./pages/CertificateService";
import CreateSchemeService from "./pages/CreateSchemeService";
import CreateCertificateService from "./pages/CreateCertificateService";
import CreateContactService from "./pages/CreateContactService";
import CreateGrievancesService from "./pages/CreateGrievancesService";
import CreateEmergencyService from "./pages/CreateEmergencyService";
import CreateFeedbackService from "./pages/CreateFeedbackService";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/scheme-service" element={<SchemeService />} />
          <Route path="/contact-service" element={<ContactService />} />
          <Route path="/grievances-service" element={<GrievancesService />} />
          <Route path="/emergency-service" element={<EmergencyService />} />
          <Route path="/feedback-service" element={<FeedbackService />} />
          <Route path="/certificate-service" element={<CertificateService />} />
          <Route path="/admin/create-scheme-service" element={<CreateSchemeService />} />
          <Route path="/admin/create-certificate-service" element={<CreateCertificateService />} />
          <Route path="/admin/create-contact-service" element={<CreateContactService />} />
          <Route path="/admin/create-grievances-service" element={<CreateGrievancesService />} />
          <Route path="/admin/create-emergency-service" element={<CreateEmergencyService />} />
          <Route path="/admin/create-feedback-service" element={<CreateFeedbackService />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
