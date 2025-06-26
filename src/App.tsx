import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Home from "./pages/Home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Donate from "./pages/Donate";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyActivity from "./pages/MyActivity";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import CreateListing from "./pages/CreateListing";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<LayoutWrapper />}>
                <Route path="/" element={<Home />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/about" element={<About />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                
                {/* Dashboard Routes - Protected */}
                <Route path="/sell/new" element={
                  <ProtectedRoute>
                    <CreateListing />
                  </ProtectedRoute>
                } />
                <Route path="/my-activity" element={
                  <ProtectedRoute>
                    <MyActivity />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
