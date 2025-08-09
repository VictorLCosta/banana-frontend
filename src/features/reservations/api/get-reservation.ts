import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Reservation } from '#/index';

export const getReservation = ({
  ReservationId,
}: {
  ReservationId: string;
}): Promise<{ data: Reservation }> => {
  return api.get(`/reservations/${ReservationId}`);
};

export const getReservationQueryOptions = (ReservationId: string) => {
  return queryOptions({
    queryKey: ['reservations', ReservationId],
    queryFn: () => getReservation({ ReservationId }),
  });
};

type UseReservationOptions = {
  ReservationId: string;
  queryConfig?: QueryConfig<typeof getReservationQueryOptions>;
};

export const useReservation = ({
  ReservationId,
  queryConfig,
}: UseReservationOptions) => {
  return useQuery({
    ...getReservationQueryOptions(ReservationId),
    ...queryConfig,
  });
};