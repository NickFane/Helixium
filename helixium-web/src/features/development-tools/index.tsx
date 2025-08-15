import { Box, VStack, IconButton } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimationSpeedControl from "./components/AnimationSpeedControl";
import { type AnimationSpeed } from "./types";
import { shouldShowDebugTools } from "@/utils/runtime-config";

interface DebugContainerProps {
  children?: ReactNode;
  onAnimationSpeedChange?: (speed: AnimationSpeed) => void;
  currentAnimationSpeed?: AnimationSpeed;
}

export default function DebugContainer({
  children,
  onAnimationSpeedChange,
  currentAnimationSpeed,
}: DebugContainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Show debug tools based on environment
  // In development mode (including tests), always show debug tools
  // In production, use runtime configuration
  const showDebugTools = import.meta.env.DEV ? true : shouldShowDebugTools();
  
  // If debug tools should not be shown, return null
  if (!showDebugTools) {
    return null;
  }

  return (
    <>
      {/* Toggle Button - Always visible */}
      <Box
        position="fixed"
        left="0"
        top="50%"
        transform="translateY(-50%)"
        zIndex={1001}
      >
        <IconButton
          aria-label={isOpen ? "Close debug panel" : "Open debug panel"}
          onClick={() => setIsOpen(!isOpen)}
          variant="solid"
          colorScheme="blue"
          size="sm"
          borderRadius="0"
          borderTopRightRadius="md"
          borderBottomRightRadius="md"
          boxShadow="lg"
          _hover={{
            bg: "blue.600",
          }}
        >
          {isOpen ? "◀" : "▶"}
        </IconButton>
      </Box>

      {/* Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            style={{
              position: "fixed",
              left: 0,
              top: "20%",
              height: "60%",
              zIndex: 1000,
              width: "280px",
            }}
          >
            <Box
              bg="gray.900"
              borderRight="2px solid"
              borderColor="blue.500"
              boxShadow="xl"
              h="100%"
              p={4}
              overflowY="auto"
              borderRadius="0"
              borderTopRightRadius="lg"
              borderBottomRightRadius="lg"
            >
              <VStack gap={4} align="stretch">
                <Box>
                  <Box
                    fontSize="lg"
                    fontWeight="bold"
                    color="blue.400"
                    mb={3}
                    pb={2}
                    borderBottom="1px solid"
                    borderColor="gray.700"
                  >
                    Debug Panel
                  </Box>
                </Box>

                <AnimationSpeedControl 
                  onSpeedChange={onAnimationSpeedChange}
                  speed={currentAnimationSpeed}
                />
                {children}
              </VStack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
