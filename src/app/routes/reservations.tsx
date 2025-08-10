/* eslint-disable react-refresh/only-export-components */

import { useDeleteManyReservations } from "@/features/reservations/api/delete-many-reservations";
import { useDeleteReservation } from "@/features/reservations/api/delete-reservation";
import { getReservationsQueryOptions, useReservations } from "@/features/reservations/api/get-reservations";
import { Reservation } from "@/models";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { LoaderFunctionArgs } from "react-router";

import { DataGrid, SelectColumn, type Column } from 'react-data-grid';
import { UpdateReservationForm } from "@/features/reservations/components/update-reservation-form";
import { getRoomsQueryOptions } from "@/features/rooms/api/get-rooms";
import { getReservationQueryOptions } from "@/features/reservations/api/get-reservation";

export const clientLoader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const url = new URL(request.url);

    const pageNumber = Number(url.searchParams.get('pageNumber') || 1);

    const query = getReservationsQueryOptions(pageNumber);

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export default function ReservationsPage() {
  const [page, setPage] = useState(1);
  const updateFormRef = useRef<HTMLDialogElement>(null)
  const [reservationId, setReservationId] = useState<string>()
  const [selectedRows, setSelectedRows] = useState((): ReadonlySet<string> => new Set());

  const { data, isLoading } 
    = useReservations({ pageNumber: page, pageSize: 10 });
  const deleteReservationMutation = useDeleteReservation()
  const deleteManyReservationsMutation = useDeleteManyReservations();

  const queryClient = useQueryClient();

  const rowKeyGetter = (row: Reservation) => {
    return row.id;
  }

  const showModal = async (id: string) => {
    await Promise.all([
      queryClient.prefetchQuery(getRoomsQueryOptions()),
      queryClient.prefetchQuery(getReservationQueryOptions(id))
    ]);

    setReservationId(id)
    updateFormRef.current?.showModal()
  }

  if (isLoading) return <div>Carregando...</div>;

  const columns: Column<Reservation>[] = [
    SelectColumn,
    { key: "description", name: "Description" },
    { key: "responsibleName", name: "Responsável", resizable: true },
    {
      key: "reservationDate",
      name: "Data",
      resizable: true,
      renderCell: ({ row }) =>
        new Date(row.reservationDate).toLocaleDateString("pt-BR")
    },
    { key: "startTime", name: "Início", resizable: true },
    { key: "endTime", name: "Fim", resizable: true },
    {
      key: "coffeeIncluded",
      name: "Café",
      resizable: true,
      renderCell: ({ row }) => (row.coffeeIncluded ? "Sim" : "Não"),
    },
    {
      key: "edit",
      name: "",
      resizable: true,
      renderCell: async ({ row }) => {
        return <button className="btn" onClick={(e) => { e.stopPropagation(); showModal(row.id); }}>Edit</button>
      }
    },
    {
      key: "delete",
      name: "",
      resizable: true,
      renderCell: ({ row }) => (
        <button className="btn" onClick={(e) => { e.stopPropagation(); deleteReservationMutation.mutate({ ReservationId: row.id }) }}>
          Delete
        </button>
      )
    }
  ];

  return (
    <>
      <div className="relative w-6xl">
        <button 
          className={`btn btn-error mb-2 ${selectedRows.size > 0 ? "inline" : "hidden"}`} 
          onClick={() => deleteManyReservationsMutation.mutate({ ids: Array.from(selectedRows) })}
        >
          Delete Selected
        </button>
        <div className="overflow-hidden rounded-2xl shadow-2xl">
          <DataGrid 
            columns={columns} 
            rows={data?.items ?? []} 
            rowKeyGetter={rowKeyGetter} 
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
          />
        </div>
      </div>

      <dialog ref={updateFormRef} className="modal">
        <div className="modal-box w-5xl">
          {reservationId && <UpdateReservationForm reservationId={reservationId} />}
        </div>
      </dialog>
    </>
  )
}