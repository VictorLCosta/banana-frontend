import { AppProvider } from "./provider";
import { AppRouter } from "./router";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}