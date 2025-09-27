import { Toaster } from "@/app/components/ui/toaster";
import { Toaster as Sonner } from "@/app/components/ui/sonner";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import "./globals.css";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard Router Component
const DashboardRouter: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect to appropriate dashboard based on user role
  switch (user.role) {
    case 'seller':
      return <Navigate to="/dashboard/seller" replace />;
    case 'consumer':
      return <Navigate to="/dashboard/consumer" replace />;
    case 'seller-consumer':
      return <Navigate to="/dashboard/seller-consumer" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/dashboard/seller" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/consumer" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Consumer Dashboard</h1>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/dashboard/seller-consumer" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Seller-Consumer Dashboard</h1>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
