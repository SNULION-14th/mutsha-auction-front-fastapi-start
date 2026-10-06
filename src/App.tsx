import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./Router";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "./hooks/useModal";
import { UserInfoProvider } from "./contexts/UserInfoProvider";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserInfoProvider>
        <ModalProvider>
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        </ModalProvider>
      </UserInfoProvider>
    </QueryClientProvider>
  );
}

export default App;
