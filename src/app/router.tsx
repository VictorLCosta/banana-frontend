/* eslint-disable react-refresh/only-export-components */

import ProtectedRoute from "@/features/auth/components/protected-route";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AppRoot } from "./routes/root";

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
          lazy: async () => {
            const component = (await import("./routes/reservation-create")).ReservationCreatePage
            return { Component: component }
          },
        },
        {
          path: '/reservations-new',
          lazy: async () => {
            const component = (await import("./routes/reservation-create")).ReservationCreatePage
            return { Component: component }
          },
        },
        {
          path: '/reservations',
          lazy: async () => {
            const component = (await import("./routes/reservations")).Reservations
            return { Component: component }
          },
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
