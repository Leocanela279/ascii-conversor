import { Toaster } from "sonner";
import { Hero } from "./components/Hero";
import { Converter } from "./components/Converter";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Converter />
      </main>
      <Footer />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "var(--color-panel)",
            color: "var(--color-on-panel)",
            border: "none",
          },
        }}
      />
    </>
  );
}
