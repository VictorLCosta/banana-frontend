import { LuBanana } from "react-icons/lu";

export function Header() {
  return (
    <header className="flex justify-between items-center fixed w-full bg-transparent hover:bg-white transition-colors p-7">
      <h2 className="font-bold text-2xl flex items-center gap-4">
        <LuBanana />
        <a href="/">banana booking</a>
      </h2>
      <a className="btn bg-black text-white" href="/reservations">My Reservations</a>
    </header>
  );
}