/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateReservationInput, createReservationInputSchema, useCreateReservation } from "../api/create-reservation";
import { useRooms } from "@/features/rooms/api/get-rooms";

export function CreateReservationForm() {
  const { data: rooms, isLoading: roomsLoading, error: roomsError } = useRooms();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateReservationInput>({
    resolver: zodResolver(createReservationInputSchema),
    defaultValues: {
      description: '',
      responsibleName: '',
      reservationDate: undefined,
      startTime: '',
      endTime: '',
      roomId: '',
      coffeeIncluded: false,
      coffeePeopleCount: null,
    }
  });

  const coffeeIncluded = watch('coffeeIncluded');

  const { mutate, isError, error, isSuccess } = useCreateReservation({
    mutationConfig: {
      onSuccess: () => alert('Reservation created successfully!'),
    }
  });

  const onSubmit = (data: CreateReservationInput) => {
    mutate({ data });
  };

  if (roomsLoading) return <div>Loading</div>;

  return (
    <>
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <input
            type="text"
            {...register('description')}
            className={`input input-bordered w-full ${errors.description ? 'input-error' : ''}`}
            placeholder="Description"
          />
          {errors.description && <p className="text-error text-sm">{errors.description.message}</p>}
        </div>
        <div>
          <label className="label">
            <span className="label-text">Responsible</span>
          </label>
          <input
            type="text"
            {...register('responsibleName')}
            className={`input input-bordered w-full ${errors.description ? 'input-error' : ''}`}
            placeholder="Description"
          />
          {errors.responsibleName && <p className="text-error text-sm">{errors.responsibleName.message}</p>}
        </div>

        <div>
          <label className="label">
            <span className="label-text">Reservation Date</span>
          </label>
          <input
            type="date"
            {...register('reservationDate', { valueAsDate: true })}
            className={`input input-bordered w-full ${errors.reservationDate ? 'input-error' : ''}`}
          />
          {errors.reservationDate && <p className="text-error text-sm">{errors.reservationDate.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Start Time</span>
            </label>
            <input
              type="time"
              {...register('startTime')}
              className={`input input-bordered w-full ${errors.startTime ? 'input-error' : ''}`}
            />
            {errors.startTime && <p className="text-error text-sm">{errors.startTime.message}</p>}
          </div>

          <div>
            <label className="label">
              <span className="label-text">End Time</span>
            </label>
            <input
              type="time"
              {...register('endTime')}
              className={`input input-bordered w-full ${errors.endTime ? 'input-error' : ''}`}
            />
            {errors.endTime && <p className="text-error text-sm">{errors.endTime.message}</p>}
          </div>
        </div>

        <div>
          <label className="label"><span className="label-text">Room (Location)</span></label>
          <select {...register('roomId')} className={`select select-bordered w-full ${errors.roomId ? 'select-error' : ''}`} defaultValue="" disabled={roomsLoading}>
            <option value="" disabled>{roomsLoading ? 'Loading rooms...' : 'Select a room'}</option>
            {rooms?.map(room => (
              <option key={room.id} value={room.id}>
                <div className="flex justify-between">
                  <p>{room.location.street}, {room.location.neighborhood} - {room.location.buildingNumber} - {room.location.city}</p>
                </div>
              </option>
            ))}
          </select>
          {roomsError && <p className="text-error text-sm">Failed to load rooms</p>}
          {errors.roomId && <p className="text-error text-sm">{errors.roomId.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('coffeeIncluded')}
            id="coffeeIncluded"
            className="checkbox"
          />
          <label htmlFor="coffeeIncluded" className="label cursor-pointer">
            Coffee Included?
          </label>
        </div>

        {coffeeIncluded && (
          <div>
            <label className="label">
              <span className="label-text">Coffee People Count</span>
            </label>
            <input
              type="number"
              {...register('coffeePeopleCount', { valueAsNumber: true })}
              className={`input input-bordered w-full ${errors.coffeePeopleCount ? 'input-error' : ''}`}
              min={1}
            />
            {errors.coffeePeopleCount && <p className="text-error text-sm">{errors.coffeePeopleCount.message}</p>}
          </div>
        )}

        {errors && errors?.root && <p className="text-error">{errors.root.message}</p>}

        <button
          type="submit"
          className="btn bg-black text-white w-full"
        >
          Create Reservation
        </button>

        {isError && (
          <div className="text-error mt-2">
            {Object.values((error as any)?.response?.data?.errors || {})
              .flat()
              .map((msg, i) => (
                <p key={i}>{msg}</p>
              ))}
          </div>
        )}
        {isSuccess && <p className="text-success mt-2">Reservation created successfully!</p>}
      </form>
    </>
  )
}