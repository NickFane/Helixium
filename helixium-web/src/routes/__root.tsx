import { Flex } from "@chakra-ui/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "@/features/navbar";

export const Route = createRootRoute({
  component: () => (
    <Flex direction="column" height="100vh" width="100%">
      <Navbar />
      <Flex flex={1} justifyContent="center" alignItems="center" p={4} pt={20}>
        <Outlet />
      </Flex>
      <TanStackRouterDevtools />
    </Flex>
  ),
});
