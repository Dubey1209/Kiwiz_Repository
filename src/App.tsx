import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import LearningStudio from "./pages/LearningStudio.new";
import UploadIllustrate from "./pages/UploadIllustrate";
import ExploreGallery from "./pages/ExploreGallery";
import MyLibrary from "./pages/MyLibrary";
import AuthFlow from "./pages/AuthFlow";
import Login from "./pages/Login";
import BillingPlans from "./pages/BillingPlans";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="studio" element={<LearningStudio />} />
        <Route path="explore" element={<ExploreGallery />} />
        <Route path="pricing" element={<BillingPlans />} />
        <Route path="contact" element={<ContactUs />} />
        
        {/* Auth Routes - Redirect to library if already authenticated */}
        <Route 
          path="login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/library" replace />} 
        />
        <Route 
          path="auth" 
          element={!isAuthenticated ? <AuthFlow /> : <Navigate to="/library" replace />} 
        />
        
        {/* Protected Routes - Only accessible when authenticated */}
        <Route 
          path="upload" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UploadIllustrate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="library" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MyLibrary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
    <Toaster />
    <Sonner position="top-right" />
  </QueryClientProvider>
);

export default App;
