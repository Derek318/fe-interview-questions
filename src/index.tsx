import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MouseProvider } from "./components/Contexts/MouseProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MouseProvider>
      <App />
    </MouseProvider>
  </React.StrictMode>
);
