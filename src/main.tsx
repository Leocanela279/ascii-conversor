import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import PrototypeHome from "./prototypes/home/PrototypeHome";
import "./index.css";

const prototype = window.location.pathname.startsWith("/prototypes/home");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {prototype ? <PrototypeHome /> : <App />}
  </StrictMode>,
);
