import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { Room } from "@/models";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get('/rooms');
  return response.data;
};

export const getRoomsQueryOptions = () => {
  return queryOptions({
    queryKey: ['rooms'],
    queryFn: () => getRooms(),
  });
};

type UseRoomsOptions = {
  queryConfig?: QueryConfig<typeof getRoomsQueryOptions>;
};

export const useRooms = ({ queryConfig = {} }: UseRoomsOptions = {}) => {
  return useQuery({
    ...getRoomsQueryOptions(),
    ...queryConfig,
  });
};