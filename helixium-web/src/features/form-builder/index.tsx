import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  Button,
  Separator,
  SimpleGrid,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

const FormBuilder = () => {
  const demos = [
    {
      title: "Gene Reusability",
      description:
        "Demonstrates how the same Gene component can be configured with different question text and IDs, maintaining separate state.",
      route: "/form-builder/demos/gene-reusability",
      icon: "🧬",
      status: "Available",
    },
    // Future demos can be added here
  ];

  const utilities = [
    {
      title: "Gene Registry Explorer",
      description:
        "Tool for exploring all registered genes and their current values.",
      route: "/form-builder/utilities/gene-explorer",
      icon: "🔍",
      status: "Coming Soon",
    },
    {
      title: "Genome Validator",
      description:
        "Validate Journey Engine Genome configurations against the schema.",
      route: "/form-builder/utilities/genome-validator",
      icon: "✅",
      status: "Coming Soon",
    },
  ];

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <VStack gap={8} align="stretch">
        <Box>
          <Heading size="xl" color="white" mb={2}>
            🛠️ Form Builder
          </Heading>
          <Text color="gray.300" fontSize="lg">
            Journey Engine development tools, demos, and utilities for building
            configurable UI journeys with the Helixium platform.
          </Text>
        </Box>

        <Separator borderColor="gray.600" />

        {/* Demos Section */}
        <Box>
          <Heading size="lg" color="white" mb={4}>
            📚 Demos
          </Heading>
          <Text color="gray.300" fontSize="md" mb={6}>
            Interactive demonstrations of Journey Engine features and patterns.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {demos.map((demo, index) => (
              <Card.Root
                key={index}
                bg="gray.800"
                borderColor="gray.700"
                _hover={{
                  borderColor: "blue.400",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                <Card.Header>
                  <HStack>
                    <Text fontSize="2xl">{demo.icon}</Text>
                    <Box>
                      <Heading size="md" color="white">
                        {demo.title}
                      </Heading>
                      <Text
                        fontSize="xs"
                        color={
                          demo.status === "Available"
                            ? "green.400"
                            : "yellow.400"
                        }
                        fontWeight="medium"
                      >
                        {demo.status}
                      </Text>
                    </Box>
                  </HStack>
                </Card.Header>
                <Card.Body>
                  <Text color="gray.300" fontSize="sm" mb={4}>
                    {demo.description}
                  </Text>
                  {demo.status === "Available" ? (
                    <Link to={demo.route}>
                      <Button colorScheme="blue" size="sm" w="full">
                        View Demo
                      </Button>
                    </Link>
                  ) : (
                    <Button colorScheme="gray" size="sm" w="full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Box>

        <Separator borderColor="gray.600" />

        {/* Utilities Section */}
        <Box>
          <Heading size="lg" color="white" mb={4}>
            🔧 Utilities
          </Heading>
          <Text color="gray.300" fontSize="md" mb={6}>
            Development tools for working with Journey Engine components and
            configurations.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            {utilities.map((utility, index) => (
              <Card.Root
                key={index}
                bg="gray.800"
                borderColor="gray.700"
                _hover={{
                  borderColor:
                    utility.status === "Available" ? "green.400" : "gray.500",
                  transform:
                    utility.status === "Available"
                      ? "translateY(-2px)"
                      : "none",
                }}
                transition="all 0.2s"
                opacity={utility.status === "Available" ? 1 : 0.7}
              >
                <Card.Header>
                  <HStack>
                    <Text fontSize="2xl">{utility.icon}</Text>
                    <Box>
                      <Heading size="md" color="white">
                        {utility.title}
                      </Heading>
                      <Text
                        fontSize="xs"
                        color={
                          utility.status === "Available"
                            ? "green.400"
                            : "yellow.400"
                        }
                        fontWeight="medium"
                      >
                        {utility.status}
                      </Text>
                    </Box>
                  </HStack>
                </Card.Header>
                <Card.Body>
                  <Text color="gray.300" fontSize="sm" mb={4}>
                    {utility.description}
                  </Text>
                  {utility.status === "Available" ? (
                    <Link to={utility.route}>
                      <Button colorScheme="green" size="sm" w="full">
                        Open Utility
                      </Button>
                    </Link>
                  ) : (
                    <Button colorScheme="gray" size="sm" w="full" disabled>
                      Coming Soon
                    </Button>
                  )}
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        </Box>

        <Separator borderColor="gray.600" />

        <Box>
          <Text color="gray.400" fontSize="sm" fontStyle="italic">
            💡 <strong>Journey Engine Development Hub:</strong> This section
            provides tools and demonstrations for building configurable UI
            journeys. Each demo showcases specific patterns and capabilities of
            the Helixium Journey Engine.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default FormBuilder;
