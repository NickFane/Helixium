import { Button, HStack, Text, IconButton, Box } from "@chakra-ui/react";
import { useState } from "react";
import {
  AnimationSpeed,
  type AnimationSpeed as AnimationSpeedType,
} from "../../types";

interface AnimationSpeedControlProps {
  onSpeedChange?: (speed: AnimationSpeedType) => void;
  speed?: AnimationSpeedType;
}

export default function AnimationSpeedControl({
  onSpeedChange,
  speed = AnimationSpeed.NORMAL,
}: AnimationSpeedControlProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSpeedChange = (newSpeed: AnimationSpeedType) => {
    onSpeedChange?.(newSpeed);
  };

  return (
    <Box>
      <HStack justify="space-between" mb={2}>
        <Text fontSize="sm" color="gray.300" fontWeight="medium">
          Animation Speed
        </Text>
        <IconButton
          size="xs"
          aria-label={isCollapsed ? "Expand controls" : "Collapse controls"}
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="ghost"
          color="gray.400"
          _hover={{ color: "gray.200" }}
        >
          {isCollapsed ? "▼" : "▲"}
        </IconButton>
      </HStack>

      {!isCollapsed && (
        <HStack gap={2}>
          <Button
            size="xs"
            colorScheme={speed === AnimationSpeed.SLOWER ? "blue" : "gray"}
            onClick={() => handleSpeedChange(AnimationSpeed.SLOWER)}
            border={speed === AnimationSpeed.SLOWER ? "2px solid" : "1px solid"}
            borderColor={
              speed === AnimationSpeed.SLOWER ? "blue.400" : "gray.500"
            }
          >
            Slower
          </Button>
          <Button
            size="xs"
            colorScheme={speed === AnimationSpeed.SLOW ? "blue" : "gray"}
            onClick={() => handleSpeedChange(AnimationSpeed.SLOW)}
            border={speed === AnimationSpeed.SLOW ? "2px solid" : "1px solid"}
            borderColor={
              speed === AnimationSpeed.SLOW ? "blue.400" : "gray.500"
            }
          >
            Slow
          </Button>
          <Button
            size="xs"
            colorScheme={speed === AnimationSpeed.NORMAL ? "blue" : "gray"}
            onClick={() => handleSpeedChange(AnimationSpeed.NORMAL)}
            border={speed === AnimationSpeed.NORMAL ? "2px solid" : "1px solid"}
            borderColor={
              speed === AnimationSpeed.NORMAL ? "blue.400" : "gray.500"
            }
          >
            Normal
          </Button>
        </HStack>
      )}
    </Box>
  );
}
