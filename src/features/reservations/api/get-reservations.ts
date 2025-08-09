import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { PagedList, Reservation } from "@/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getReservations = (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagedList<Reservation>> => {
  return api.get('/reservations', { params: { pageNumber, pageSize } });
};

export const getReservationsQueryOptions = (pageNumber: number = 1, pageSize: number = 10) => {
  return queryOptions({
    queryKey: ['reservations', pageNumber, pageSize],
    queryFn: () => getReservations(pageNumber, pageSize),
  });
};

type UseReservationsOptions = {
  pageNumber: number;
  pageSize: number;
  queryConfig?: QueryConfig<typeof getReservationsQueryOptions>;
};

export const useReservations = ({ pageNumber, pageSize, queryConfig = {} }: UseReservationsOptions) => {
  return useQuery({
    ...getReservationsQueryOptions(pageNumber, pageSize),
    ...queryConfig,
  });
};