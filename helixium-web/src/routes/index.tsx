import { Center, Flex, Separator, Text } from "@chakra-ui/react";
import "../app/App.css";
import { createFileRoute } from "@tanstack/react-router";
import ClickDashboard from "@/features/clickDashboard";
import { createStore, Provider } from "jotai";

// Create stores outside component to prevent recreation on re-renders
const store1 = createStore();
const store2 = createStore();

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Flex flexDir={"column"} gap={4} maxW="800px" w="100%">
        <Center>
          <Text fontSize={"2xl"} fontWeight={"semibold"} color="gray.300">
            Welcome to Helixium
          </Text>
        </Center>
        <Flex justifyContent={"space-between"} gap={4}>
          <Provider store={store1}>
            <ClickDashboard id="dashboard-1" />
          </Provider>
          <Separator orientation="vertical" />
          <Provider store={store2}>
            <ClickDashboard id="dashboard-2" />
          </Provider>
        </Flex>
      </Flex>
    </>
  );
}

export default Index;
