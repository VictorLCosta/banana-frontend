import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import { Outlet } from "react-router";

export function AppRoot() {
  return (
    <div className="min-h-[100vh]">
      <Header />
      <main className="flex justify-center items-center h-[100vh] bg-main-yellow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}