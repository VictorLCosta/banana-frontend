import { Footer } from "@/components/layouts/footer";
import { Header } from "@/components/layouts/header";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router";

export function AppRoot() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const el = mutation.target as HTMLElement;
          if (el.style.display === "none") {
            el.style.display = "block";
          }
        }
      }
    });

    observer.observe(rootRef.current, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="min-h-[100vh] !block">
      <Header />
      <main className="flex justify-center items-center h-[100vh] bg-main-yellow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}