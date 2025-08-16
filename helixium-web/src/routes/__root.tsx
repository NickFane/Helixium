import { Flex } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "@/features/navbar";
import SubNavbar from "@/components/SubNavbar";
import PageTransition from "@/components/PageTransition";
import EnvironmentIndicator from "@/components/EnvironmentIndicator";
import { shouldShowDebugTools } from "@/utils/runtime-config";

export const Route = createRootRoute({
  component: () => {
    // Use runtime configuration to determine if debug tools should be shown
    // This works for both development (Vite dev server) and production (runtime injection)
    const showDebugTools = shouldShowDebugTools();

    return (
      <Flex direction="column" height="100vh" width="100%">
        <Navbar />
        <SubNavbar />
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          p={4}
          pt={28}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Flex>
        {showDebugTools && <TanStackRouterDevtools />}
        {showDebugTools && <EnvironmentIndicator />}
      </Flex>
    );
  },
});
