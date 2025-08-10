/* eslint-disable @typescript-eslint/no-explicit-any */


import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRooms } from "@/features/rooms/api/get-rooms";
import { UpdateReservationInput, updateReservationInputSchema, useUpdateReservation } from "../api/update-reservation";
import { useReservation } from "../api/get-reservation";

function formatDateToInput(d?: string | Date | null) {
  if (!d) return "";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function UpdateReservationForm({ reservationId }: { reservationId: string }) {
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useRooms();
  const { data } = useReservation({ reservationId });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateReservationInput>({
    resolver: zodResolver(updateReservationInputSchema),
    defaultValues: {
      description: "",
      responsibleName: "",
      reservationDate: new Date(),
      startTime: "",
      endTime: "",
      roomId: "",
      coffeeIncluded: false,
      coffeePeopleCount: undefined,
    },
  });

  // Quando os dados da reserva chegarem, reset com os tipos corretos:
  useEffect(() => {
    if (!data) return;

    reset({
      description: data.description ?? "",
      responsibleName: data.responsibleName ?? "",
      reservationDate: data.reservationDate ? new Date(data.reservationDate) : new Date(),
      startTime: data.startTime ? String(data.startTime).slice(0,5) : "",
      endTime: data.endTime ? String(data.endTime).slice(0,5) : "",
      roomId: data.roomId ?? "",
      coffeeIncluded: Boolean(data.coffeeIncluded),
      coffeePeopleCount: data.coffeePeopleCount ?? undefined,
    });
  }, [data, reset, reservationId]);

  const coffeeIncluded = watch('coffeeIncluded');

  const { mutate, isError, error, isSuccess } = useUpdateReservation({
    mutationConfig: {
      onSuccess: () => alert('Reservation updated successfully!'),
    }
  });

  // debug helper: log validation errors quando o submit falhar
  const onSubmit = (payload: UpdateReservationInput) => {
    mutate({ data: payload, reservationId });
  };

  const onInvalid = (errs: any) => {
    console.log("Validation failed:", errs);
  };

  if (roomsLoading) return <div>Loading</div>;

  return (
    <>
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="max-w-md mx-auto p-6 space-y-4">
        <div>
          <label className="label"><span className="label-text">Description</span></label>
          <input
            type="text"
            {...register('description')}
            className={`input input-bordered w-full ${errors.description ? 'input-error' : ''}`}
            placeholder="Description"
          />
          {errors.description && <p className="text-error text-sm">{errors.description.message as any}</p>}
        </div>

        <div>
          <label className="label"><span className="label-text">Responsible</span></label>
          <input
            type="text"
            {...register('responsibleName')}
            className={`input input-bordered w-full ${errors.responsibleName ? 'input-error' : ''}`}
            placeholder="Responsible name"
          />
          {errors.responsibleName && <p className="text-error text-sm">{errors.responsibleName.message as any}</p>}
        </div>

        <div>
          <label className="label"><span className="label-text">Reservation Date</span></label>

          {/* Controller para converter Date <-> YYYY-MM-DD string */}
          <Controller
            control={control}
            name="reservationDate"
            render={({ field }) => {
              const valueForInput = field.value ? formatDateToInput(field.value as any) : "";
              return (
                <input
                  type="date"
                  value={valueForInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v ? new Date(v + "T00:00:00") : null);
                  }}
                  className={`input input-bordered w-full ${errors.reservationDate ? 'input-error' : ''}`}
                />
              );
            }}
          />
          {errors.reservationDate && <p className="text-error text-sm">{(errors.reservationDate as any).message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label"><span className="label-text">Start Time</span></label>
            <input
              type="time"
              {...register('startTime')}
              className={`input input-bordered w-full ${errors.startTime ? 'input-error' : ''}`}
            />
            {errors.startTime && <p className="text-error text-sm">{errors.startTime.message as any}</p>}
          </div>

          <div>
            <label className="label"><span className="label-text">End Time</span></label>
            <input
              type="time"
              {...register('endTime')}
              className={`input input-bordered w-full ${errors.endTime ? 'input-error' : ''}`}
            />
            {errors.endTime && <p className="text-error text-sm">{errors.endTime.message as any}</p>}
          </div>
        </div>

        <div>
          <label className="label"><span className="label-text">Room</span></label>
          <select {...register('roomId')} className={`select select-bordered w-full ${errors.roomId ? 'select-error' : ''}`} defaultValue="" disabled={roomsLoading}>
            <option value="" disabled>{roomsLoading ? 'Loading rooms...' : 'Select a room'}</option>
            {rooms?.map(room => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
          {roomsError && <p className="text-error text-sm">Failed to load rooms</p>}
          {errors.roomId && <p className="text-error text-sm">{errors.roomId.message as any}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register('coffeeIncluded')} id="coffeeIncluded" className="checkbox" />
          <label htmlFor="coffeeIncluded" className="label cursor-pointer">Coffee Included?</label>
        </div>

        {coffeeIncluded && (
          <div>
            <label className="label"><span className="label-text">Coffee People Count</span></label>
            <input
              type="number"
              {...register('coffeePeopleCount', { valueAsNumber: true })}
              className={`input input-bordered w-full ${errors.coffeePeopleCount ? 'input-error' : ''}`}
              min={1}
            />
            {errors.coffeePeopleCount && <p className="text-error text-sm">{errors.coffeePeopleCount.message as any}</p>}
          </div>
        )}

        {errors && (errors as any).root && <p className="text-error">{(errors as any).root.message}</p>}

        <button type="submit" className="btn bg-black text-white w-full">Update Reservation</button>

        {isError && <p className="text-error mt-2">{(error as any)?.message || 'Error updating reservation'}</p>}
        {isSuccess && <p className="text-success mt-2">Reservation updated successfully!</p>}
      </form>
    </>
  );
}
