//@@viewOn:imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CoinContextProvider } from "./context/CoinContext";
import App from "./App.jsx";
import "./index.css";
//@@viewOff:imports

//@@viewOn:render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <CoinContextProvider>
        <App />
      </CoinContextProvider>
    </BrowserRouter>
  </StrictMode>
);
//@@viewOff:render
