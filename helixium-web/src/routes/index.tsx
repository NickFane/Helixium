import { Center, Flex } from "@chakra-ui/react";
import "../app/App.css";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <Flex>
        <Center>
          <h1>Helixium</h1>
        </Center>
      </Flex>
    </>
  );
}

export default Index;
