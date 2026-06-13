// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
import { logger } from "./lib/betterstack.ts";
import App from "./App.tsx";
// import { ErrorBoundary } from "./ErrorBoundary.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";

const options = {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: "2026-01-30",
} as const;

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: "identified_only",
  session_recording: {
    maskAllInputs: true, // recommended
  },
  enable_heatmaps: true,
  autocapture: true,
  capture_pageview: true,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  // <ErrorBoundary>
  <PostHogProvider
    apiKey={import.meta.env.VITE_POSTHOG_PROJECT_TOKEN}
    options={options}
  >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </PostHogProvider>,

  // </ErrorBoundary>
  // </StrictMode>
);

window.addEventListener("error", (event) => {
  logger.error("Global JS Error", {
    message: event.message,
    stack: event.error?.stack,
  });
});

window.addEventListener("unhandledrejection", (event) => {
  logger.error("Unhandled Promise Rejection", {
    reason: event.reason,
  });
});
