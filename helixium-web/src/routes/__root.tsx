import { Flex } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "@/features/navbar";
import PageTransition from "@/components/PageTransition";

// Check if we should show debug tools based on deployment environment
// This is controlled by VITE_DEPLOYMENT_ENV build argument:
// - 'dev': Shows debug overlay (feature stack deployments)
// - 'prod': Hides debug overlay (production deployments)
// Note: This is separate from NODE_ENV to keep build concerns separate from deployment concerns
const shouldShowDebugTools = import.meta.env.VITE_DEPLOYMENT_ENV === 'dev';

export const Route = createRootRoute({
  component: () => (
    <Flex direction="column" height="100vh" width="100%">
      <Navbar />
      <Flex flex={1} justifyContent="center" alignItems="center" p={4} pt={20}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Flex>
      {shouldShowDebugTools && <TanStackRouterDevtools />}
    </Flex>
  ),
});
