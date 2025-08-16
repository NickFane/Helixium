import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Code,
  Separator,
} from "@chakra-ui/react";
import { useStore } from "jotai";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FullNameGene, GeneRegistry } from "@/features/form-builder/genes";

export const Route = createFileRoute("/form-builder/demos/gene-reusability")({
  component: GeneReusabilityDemo,
});

function GeneReusabilityDemo() {
  const store = useStore();
  const [externalValues, setExternalValues] = useState<Record<string, string>>(
    {}
  );
  const [lastAction, setLastAction] = useState<string>("");

  // Sample gene IDs - same component, different instances
  const primaryNameGeneId = "primary-fullname-gene";
  const emergencyContactGeneId = "emergency-contact-fullname-gene";

  // Function to demonstrate external access to gene values
  const handleGetAllValues = () => {
    const allValues = store.get(GeneRegistry.getAllValues());
    const registeredIds = store.get(GeneRegistry.getRegisteredIds());

    setExternalValues(allValues as Record<string, string>);
    setLastAction("Retrieved all gene values");

    console.log(
      "All registered gene IDs:",
      Array.from(registeredIds as Set<string>)
    );
    console.log("All gene values:", allValues);
  };

  const handleGetSpecificValue = (geneId: string, label: string) => {
    const specificValue = store.get(GeneRegistry.getValueById(geneId));

    // Display single value in same format as "Get All Values"
    const singleValueObject = { [geneId]: specificValue };
    setExternalValues(singleValueObject);
    setLastAction(`Retrieved ${label} value`);

    console.log(`Value for ${label} (${geneId}):`, specificValue);
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="lg" color="white" mb={2}>
            🧬 Gene Reusability Demo
          </Heading>
          <Text color="gray.300" fontSize="md">
            This demonstrates how the same Gene component can be reused with
            different configurations and IDs, maintaining completely separate
            state. Notice how each instance shows different question text while
            using the same underlying component and maintaining independent
            Allele values.
          </Text>
        </Box>

        <Separator borderColor="gray.600" />

        {/* Sample Gene Components - Same Component, Different IDs */}
        <Box>
          <Text color="gray.200" fontSize="lg" fontWeight="medium" mb={4}>
            Configurable Gene Components (Same Component, Different Questions &
            State):
          </Text>
          <VStack gap={6} align="stretch">
            <Box>
              <Text color="gray.300" fontSize="md" mb={3} fontWeight="medium">
                📝 Primary Contact Information:
              </Text>
              <FullNameGene
                geneId={primaryNameGeneId}
                questionText="What is your full name?"
              />
            </Box>

            <Box>
              <Text color="gray.300" fontSize="md" mb={3} fontWeight="medium">
                🚨 Emergency Contact Information:
              </Text>
              <FullNameGene
                geneId={emergencyContactGeneId}
                questionText="What is your emergency contact's full name?"
              />
            </Box>
          </VStack>
        </Box>

        <Separator borderColor="gray.600" />

        {/* External Access Demo */}
        <Box>
          <Text color="gray.200" fontSize="lg" fontWeight="medium" mb={4}>
            External Access Demo:
          </Text>
          <VStack gap={3} align="stretch">
            <Button
              colorScheme="blue"
              onClick={handleGetAllValues}
              size="sm"
              maxW="300px"
            >
              Get All Gene Values
            </Button>

            <Button
              colorScheme="green"
              onClick={() =>
                handleGetSpecificValue(primaryNameGeneId, "Primary Contact")
              }
              size="sm"
              maxW="300px"
            >
              Get Primary Contact Value
            </Button>

            <Button
              colorScheme="orange"
              onClick={() =>
                handleGetSpecificValue(
                  emergencyContactGeneId,
                  "Emergency Contact"
                )
              }
              size="sm"
              maxW="300px"
            >
              Get Emergency Contact Value
            </Button>

            {Object.keys(externalValues).length > 0 && (
              <Box mt={4} p={4} bg="gray.900" borderRadius="md">
                <Text color="gray.200" fontSize="sm" mb={2}>
                  {lastAction}:
                </Text>
                <Code
                  display="block"
                  p={3}
                  bg="gray.800"
                  color="gray.100"
                  whiteSpace="pre"
                >
                  {JSON.stringify(externalValues, null, 2)}
                </Code>
              </Box>
            )}
          </VStack>
        </Box>

        <Separator borderColor="gray.600" />

        <Box>
          <Text color="gray.400" fontSize="sm" fontStyle="italic">
            💡 <strong>Configurable Gene Pattern:</strong> Notice how the same
            FullNameGene component displays different question text based on
            props, while maintaining completely separate state via unique
            geneIds. This is the foundation of the Journey Engine - components
            can be reused and configured across different contexts while
            maintaining independent Allele values.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default GeneReusabilityDemo;
