import { Flex } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "@/features/navbar";
import PageTransition from "@/components/PageTransition";
import { shouldShowDebugTools } from "@/utils/runtime-config";

export const Route = createRootRoute({
  component: () => {
    // Check if we should show debug tools based on deployment environment
    // In development mode (including tests), always show debug tools
    // In production, use runtime configuration controlled by DEPLOYMENT_ENV
    const showDebugTools = import.meta.env.DEV ? true : shouldShowDebugTools();

    return (
      <Flex direction="column" height="100vh" width="100%">
        <Navbar />
        <Flex flex={1} justifyContent="center" alignItems="center" p={4} pt={20}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Flex>
        {showDebugTools && <TanStackRouterDevtools />}
      </Flex>
    );
  },
});
