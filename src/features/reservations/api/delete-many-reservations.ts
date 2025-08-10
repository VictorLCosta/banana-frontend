import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getReservationsQueryOptions } from './get-reservations';

import { z } from 'zod';

export const createReservationInputSchema = z.object({
  ids: z.array(z.string()).min(1, 'Required'),
});

export type DeleteManyReservationInput = z.infer<typeof createReservationInputSchema>;

export const deleteManyReservations = (data: DeleteManyReservationInput) => {
  return api.post(`/reservations/delete-many`, data);
};

type UseDeleteReservationOptions = {
  mutationConfig?: MutationConfig<typeof deleteManyReservations>;
};

export const useDeleteManyReservations = ({
  mutationConfig,
}: UseDeleteReservationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getReservationsQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteManyReservations,
  });
};