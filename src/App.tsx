import { Toaster } from "sonner";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Converter } from "./components/Converter";
import { Cta } from "./components/Cta";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Features />
        <Converter />
        <Cta />
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
