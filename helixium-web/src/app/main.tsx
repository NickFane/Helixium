import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ChakraProvider,
  createSystem,
  defineConfig,
  defaultConfig,
} from "@chakra-ui/react";
import "./index.css";
import App from "./App.tsx";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "../routeTree.gen";

const router = createRouter({ routeTree });

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
});

const system = createSystem(defaultConfig, config);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
