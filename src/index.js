import React from "react";
import "./index.css";
import App from "./App";
import { MsalProvider } from "@azure/msal-react";
import msalInstance from "./msalConfig";
import { createRoot } from "react-dom/client";
import { LoaderProvider } from "./customHooks/loading/LoaderContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ErrorBoundary from "./ErrorBoundary";

// ✅ Suppress known harmless ResizeObserver loop errors
const suppressResizeObserverErrors = (e) => {
  const message = e?.message || "";
  const resizeObserverErrors = [
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications.",
  ];
  if (resizeObserverErrors.includes(message)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
};

window.addEventListener("error", suppressResizeObserverErrors);
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
});

// ✅ Optional: filter in dev console too
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    args.length &&
    typeof args[0] === "string" &&
    args[0].includes("ResizeObserver loop")
  ) {
    return;
  }
  originalConsoleError(...args);
};

const container = document.getElementById("root");
const root = createRoot(container);

const theme = createTheme({
  palette: {
    primary: { main: "rgb(15, 168, 233)" },
    secondary: { main: "rgb(77,208,225)" },
    error: { main: "#FF0000" },
    text: { primary: "#000000" },
    background: { default: "#f2f4f7" },
  },
  typography: { fontSize: 11.2 },
});

root.render(
  <MsalProvider instance={msalInstance}>
    <ThemeProvider theme={theme}>
      <LoaderProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </LoaderProvider>
    </ThemeProvider>
  </MsalProvider>
);
