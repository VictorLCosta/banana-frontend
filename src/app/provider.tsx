import React from "react";

import { queryConfig } from "@/lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { MainErrorFallback } from "@/components/errors/main";
import { AuthProvider } from "@/stores/authStore";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <React.Suspense>
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider qc={queryClient}>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
