import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { initializeAuthInterceptors } from "@/services/api/authInterceptors";
import { initializeSupabase } from "@/lib/supabase";

// Add global error handler first
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
  const rootEl = document.getElementById("root");
  if (rootEl && !rootEl.innerHTML.includes("Application Error")) {
    rootEl.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; font-family: system-ui;">
        <div style="text-align: center; max-width: 600px;">
          <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Application Error</h1>
          <p style="color: #666; margin-bottom: 1.5rem;">
            ${event.error?.message || "Unknown error occurred"}
          </p>
          <pre style="text-align: left; background: #f5f5f5; padding: 1rem; border-radius: 0.25rem; overflow: auto; margin-bottom: 1.5rem; font-size: 0.875rem;">
${event.error?.stack || "No stack trace available"}
          </pre>
          <button 
            onclick="window.location.reload()" 
            style="padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.375rem; cursor: pointer;"
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});

console.log("Starting app initialization...");
console.log("Imports loaded");

// Initialize auth interceptors with error handling
try {
  initializeAuthInterceptors();
  console.log("Auth interceptors initialized");
} catch (error) {
  console.error("Failed to initialize auth interceptors:", error);
}

// Initialize Supabase connection (optional)
try {
  void initializeSupabase();
} catch (error) {
  console.error("Failed to initialize Supabase:", error);
}

// Get root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  const errorMsg = "Root element not found";
  console.error(errorMsg);
  document.body.innerHTML = `<div style="padding: 2rem; text-align: center;"><h1>Error: ${errorMsg}</h1></div>`;
  throw new Error(errorMsg);
}

console.log("Root element found, rendering...");

// Render app with error boundary
try {
  const root = createRoot(rootElement);
  root.render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <App />
    </ThemeProvider>
  );
  console.log("✅ App rendered successfully");
} catch (error) {
  console.error("❌ Failed to render app:", error);
  // Render a basic error message if rendering fails
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; font-family: system-ui;">
      <div style="text-align: center; max-width: 600px;">
        <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">Application Error</h1>
        <p style="color: #666; margin-bottom: 1.5rem;">
          We encountered an error while loading the application. Please check the console for details.
        </p>
        <pre style="text-align: left; background: #f5f5f5; padding: 1rem; border-radius: 0.25rem; overflow: auto; margin-bottom: 1.5rem; font-size: 0.875rem;">
${error instanceof Error ? error.stack : String(error)}
        </pre>
        <button 
          onclick="window.location.reload()" 
          style="padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 0.375rem; cursor: pointer;"
        >
          Reload Page
        </button>
      </div>
    </div>
  `;
}
