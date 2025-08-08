import {
  clickCountDisplayAtom,
  clickCountReducerAtom,
} from "@/store/atoms/clickCountAtom";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useAtom, useStore } from "jotai";

const ClickDashboard = ({ id }: { id: string }) => {
  const store = useStore();
  const [, dispatch] = useAtom(clickCountReducerAtom);
  const clickCountText = store.get(clickCountDisplayAtom);
  return (
    <Flex flexDir={"column"} gap={2}>
      <Text>{id}</Text>
      <Text>{clickCountText}</Text>
      <Button onClick={() => dispatch({ type: "increment" })}>Click me</Button>
    </Flex>
  );
};

export default ClickDashboard;
