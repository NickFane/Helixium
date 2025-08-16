import { Box, Text, Input, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { geneAlleleAtomFamily, registerGeneAtom } from "../atoms";

interface FullNameGeneProps {
  /**
   * Unique identifier for this gene instance
   * External components can use this ID to access the allele value
   */
  geneId: string;
  /**
   * The question text to display to the user
   * This makes the component reusable for different contexts
   */
  questionText: string;
}

/**
 * FullNameGene - A sample gene component for collecting a user's full name
 *
 * This component demonstrates the Journey Engine pattern:
 * - Uses Jotai atoms for state management (alleles)
 * - Registers itself for external ID-based access
 * - Follows the Gene -> Allele terminology from the Journey Engine
 */
const FullNameGene = ({ geneId, questionText }: FullNameGeneProps) => {
  // Get the allele (answer value) atom for this specific gene
  const alleleAtom = geneAlleleAtomFamily(geneId);
  const [alleleValue, setAlleleValue] = useAtom(alleleAtom);

  // Get the register function to add this gene to the registry
  const [, registerGene] = useAtom(registerGeneAtom);

  // Register this gene when component mounts
  useEffect(() => {
    registerGene(geneId);
  }, [geneId, registerGene]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlleleValue(event.target.value);
  };

  return (
    <Box
      p={6}
      bg="gray.800"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.700"
      maxW="500px"
      w="full"
    >
      <VStack gap={4} align="stretch">
        <Text fontSize="lg" fontWeight="medium" color="white" textAlign="left">
          {questionText}
        </Text>

        <Input
          placeholder="Enter name"
          value={alleleValue}
          onChange={handleInputChange}
          variant="outline"
          bg="gray.700"
          border="1px solid"
          borderColor="gray.600"
          color="white"
          _placeholder={{ color: "gray.400" }}
          _focus={{
            bg: "gray.600",
            borderColor: "blue.400",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
          }}
          _hover={{
            bg: "gray.600",
          }}
          size="lg"
        />

        {/* Debug info - shows the gene ID and current value */}
        <Text fontSize="xs" color="gray.500" fontFamily="mono">
          Gene ID: {geneId} | Allele: "{alleleValue}"
        </Text>
      </VStack>
    </Box>
  );
};

export default FullNameGene;
