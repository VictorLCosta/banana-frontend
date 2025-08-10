import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Reservation } from '#/index';

export const getReservation = async ({
  reservationId,
}: {
  reservationId: string;
}): Promise<Reservation> => {
  const response = await api.get(`/reservations/${reservationId}`);
  return response.data;
};

export const getReservationQueryOptions = (reservationId: string) => {
  return queryOptions({
    queryKey: ['reservations', reservationId],
    queryFn: () => getReservation({ reservationId }),
  });
};

type UseReservationOptions = {
  reservationId: string;
  queryConfig?: QueryConfig<typeof getReservationQueryOptions>;
};

export const useReservation = ({
  reservationId,
  queryConfig,
}: UseReservationOptions) => {
  return useQuery({
    ...getReservationQueryOptions(reservationId),
    ...queryConfig,
  });
};