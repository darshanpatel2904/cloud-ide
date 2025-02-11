import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import "@/index.css";
import { BrowserRouter } from "react-router-dom";
import PlaygroundContextProvider from "@/contexts/PlaygroundContext.tsx";
import AuthContextProvider from "@/contexts/AuthContext.tsx";
import Layout from "@/components/Layout.tsx";
import LoadingContextProvider from "./contexts/LoadingContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingContextProvider>
        <AuthContextProvider>
          <PlaygroundContextProvider>
            <Layout>
              <App />
            </Layout>
          </PlaygroundContextProvider>
        </AuthContextProvider>
      </LoadingContextProvider>
    </BrowserRouter>
  </StrictMode>
);
