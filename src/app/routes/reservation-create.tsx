import { CreateReservationForm } from "@/features/reservations/components/create-reservation-form";
import { useRef } from "react";

export function ReservationCreatePage() {
  const myModalRef = useRef<HTMLDialogElement>(null);

  function openModal() {
    myModalRef.current?.showModal()
  }

  return (
    <>
      <div className="flex flex-col gap-y-10 text-center justify-center items-center">
        <h1 className="text-7xl font-bold tracking-wider">Run more engaging sessions. <br />Get better outcomes.</h1>
        <button className="btn btn-xl bg-black text-white" onClick={() => openModal()}>Create Reservation</button>
      </div>

      <dialog ref={myModalRef} className="modal">
        <div className="modal-box w-5xl">
          <CreateReservationForm />
        </div>
      </dialog>
    </>
  );
}
