import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import HomePage from "@/pages/HomePage";
import SystemCardPage from "@/pages/SystemCardPage";
import CatalogPage from "@/pages/CatalogPage";
import SupportPage from "@/pages/SupportPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import TicketPage from "@/pages/TicketPage";
import NotFound from "./pages/NotFound";
import { InfoSystem, OIV } from "@/data/oiv";

interface User {
  name: string;
  oiv: string;
  phone: string;
  role: "admin" | "user";
}

interface SelectedSystem {
  system: InfoSystem;
  oiv: OIV;
}

const queryClient = new QueryClient();

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedSystems, setSelectedSystems] = useState<SelectedSystem[]>([]);

  return (
    <div className="min-h-screen flex flex-col font-golos bg-background">
      <Header user={user} onLogin={setUser} onLogout={() => setUser(null)} />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                selectedSystems={selectedSystems}
                onSystemsChange={setSelectedSystems}
              />
            }
          />
          <Route path="/system/:systemId" element={<SystemCardPage user={user} />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/support" element={<SupportPage user={user} />} />
          <Route path="/profile" element={<ProfilePage user={user} />} />
          <Route path="/admin" element={<AdminPage user={user} />} />
          <Route path="/ticket/:ticketId" element={<TicketPage user={user} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="bg-gov-navy text-white/50 text-xs py-4 px-6 text-center">
        © 2026 Единый портал информационных систем Краснодарского края
      </footer>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;