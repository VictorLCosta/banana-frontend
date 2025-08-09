import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

import { getReservationsQueryOptions } from './get-reservations';

export const deleteReservation = ({
  ReservationId,
}: {
  ReservationId: string;
}) => {
  return api.delete(`/reservations/${ReservationId}`);
};

type UseDeleteReservationOptions = {
  mutationConfig?: MutationConfig<typeof deleteReservation>;
};

export const useDeleteReservation = ({
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
    mutationFn: deleteReservation,
  });
};