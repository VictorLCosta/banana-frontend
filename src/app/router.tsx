/* eslint-disable react-refresh/only-export-components */

import ProtectedRoute from "@/features/auth/components/protected-route";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AppRoot } from "./routes/root";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m;
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  };
};

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/login',
      lazy: async () => {
        const component = (await import("./routes/login")).LoginPage
        return { Component: component }
      },
    },
    {
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '/',
          lazy: () => import("./routes/reservation-create").then(convert(queryClient))
        },
        {
          path: '/reservations-new',
          lazy: () => import("./routes/reservation-create").then(convert(queryClient))
        },
        {
          path: '/reservations',
          lazy: () => import("./routes/reservations").then(convert(queryClient))
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const component = (await import("./routes/not-found")).NotFound
        return { Component: component }
      },
    },
  ])

export const AppRouter = () => {
  const queryClient = useQueryClient();

  const router = useMemo(() => createAppRouter(queryClient), [queryClient]);

  return <RouterProvider router={router} />;
}
