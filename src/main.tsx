import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,      // 1 hour — treat data as fresh
      gcTime: 1000 * 60 * 60 * 2,     // 2 hours — keep unused data in memory
      refetchOnWindowFocus: false,     // don't refetch when user switches tabs
      refetchOnMount: false,           // don't refetch if data is within staleTime
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
