import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Reservation } from '#/index';

import { getReservationQueryOptions } from './get-reservation';

export const updateReservationInputSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required."),
  responsibleName: z
    .string()
    .min(1, "Description is required."),
  reservationDate: z
    .date()
    .min(1, "Reservation date is required."),
  startTime: z
    .iso
    .time()
    .min(1, "Start time is required."),
  endTime: z
    .iso
    .time()
    .min(1, "End time is required."),
  roomId: z
    .string()
    .min(1, "Room ID is required."),
  coffeeIncluded: z.boolean(),
  coffeePeopleCount: z
    .number()
    .nullable()
})
.refine(data => {
  const { startTime, endTime } = data;
  return startTime && endTime > startTime;
}, { message: "End time should be greater than start time" })
.refine(data => {
  const { coffeeIncluded, coffeePeopleCount } = data;
  return !coffeeIncluded || (coffeePeopleCount !== null && coffeePeopleCount > 0);
}, { message: "Coffee people count must be greater than 0 when coffee is included" });

export type UpdateReservationInput = z.infer<typeof updateReservationInputSchema>;

export const updateReservation = ({
  data,
  reservationId,
}: {
  data: UpdateReservationInput;
  reservationId: string;
}): Promise<Reservation> => {
  return api.put(`/reservations/${reservationId}`, data);
};

type UseUpdateReservationOptions = {
  mutationConfig?: MutationConfig<typeof updateReservation>;
};

export const useUpdateReservation = ({
  mutationConfig,
}: UseUpdateReservationOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      queryClient.refetchQueries({
        queryKey: getReservationQueryOptions(data.id).queryKey,
      });
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateReservation,
  });
};