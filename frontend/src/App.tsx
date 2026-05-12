import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Jam from "./pages/Jam.tsx";
import Debate from "./pages/Debate.tsx";
import Leaderboard from "./pages/Leaderboard.tsx";
import Vote from "./pages/Vote.tsx";
import Results from "./pages/Results.tsx";
import RumbleLive from "./pages/RumbleLive.tsx";
import RumbleResults from "./pages/RumbleResults.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jam" element={<Jam />} />
          <Route path="/debate" element={<Debate />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/results" element={<Results />} />
          <Route path="/rumble/:rumbleId" element={<RumbleLive />} />
          <Route path="/rumble/:rumbleId/results" element={<RumbleResults />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
