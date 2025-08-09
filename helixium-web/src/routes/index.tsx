import { Center, Flex } from "@chakra-ui/react";
import "../app/App.css";
import { createFileRoute } from "@tanstack/react-router";
import ClickDashboard from "@/features/clickDashboard";
import { createStore, Provider } from "jotai";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const store1 = createStore();
  const store2 = createStore();

  return (
    <>
      <Flex flexDir={"column"} gap={4}>
        <Center>
          <h1>Helixium</h1>
        </Center>
        <Flex justifyContent={"space-between"} gap={4}>
          <Provider store={store1}>
            <ClickDashboard id="1" />
          </Provider>
          <Provider store={store2}>
            <ClickDashboard id="2" />
          </Provider>
        </Flex>
      </Flex>
    </>
  );
}

export default Index;
