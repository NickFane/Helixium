import { Flex, Separator } from "@chakra-ui/react";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <Flex direction="column" height="100%" width={"600px"}>
      <Flex justifyContent={"center"} gap={4}>
        <Link to="/">Home</Link> <Link to="/about">About</Link>
      </Flex>
      <Separator size={"md"} width={"100%"} />
      <Flex flex={1} justifyContent={"center"}>
        <Outlet />
      </Flex>
      <TanStackRouterDevtools />
    </Flex>
  ),
});
