import { Center, Flex, Text, Box, Heading, HStack, Image, VStack, SimpleGrid } from "@chakra-ui/react";
import "../app/App.css";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const technologies = [
    {
      name: "React 19",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      description: "Modern React with latest features"
    },
    {
      name: "TypeScript",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      description: "Type-safe development"
    },
    {
      name: "Vite",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
      description: "Fast build tool and dev server"
    },
    {
      name: "Chakra UI",
      logo: "https://img.icons8.com/?size=100&id=114092&format=png&color=000000",
      description: "Modern component library"
    },
    {
      name: "TanStack Router",
      logo: "https://raw.githubusercontent.com/TanStack/router/main/media/repo-header.png",
      description: "Type-safe routing"
    },
    {
      name: "Jotai",
      logo: "https://raw.githubusercontent.com/pmndrs/jotai/main/img/jotai-mascot.png",
      description: "Atomic state management"
    },
    {
      name: "Framer Motion",
      logo: "https://cdn.worldvectorlogo.com/logos/framer-motion.svg",
      description: "Animation library"
    },
    {
      name: "Playwright",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg",
      description: "End-to-end testing"
    },
    {
      name: "Docker",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      description: "Containerization"
    },
    {
      name: "AWS ECS",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      description: "Cloud deployment"
    },
    {
      name: "Nginx",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
      description: "Web server"
    },
    {
      name: "Terraform",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg",
      description: "Infrastructure as Code"
    }
  ];

  return (
    <Flex flexDir={"column"} gap={8} maxW="1200px" w="100%" mx="auto" px={4}>
      <Center>
        <VStack gap={4}>
          <Heading as="h1" size="2xl" mb={2} color="white">
            About Helixium
          </Heading>
          <Text fontSize="xl" color="gray.300" textAlign="center">
            A Modern "Configurable UI Journeys" Application
          </Text>
        </VStack>
      </Center>
      
      <Box bg="gray.800" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
        <Text fontSize={"lg"} color="gray.100" mb={4}>
          Welcome to Helixium - A cutting-edge web application built with modern technologies
        </Text>
        
        <Text color="gray.300" lineHeight="1.6" mb={4}>
          Helixium is a sophisticated web application designed to provide configurable user interface 
          journeys with exceptional performance and developer experience. Built from the ground up 
          with modern React patterns, type safety, and scalable architecture principles.
        </Text>
        
        <Text color="gray.300" lineHeight="1.6" mb={6}>
          The application demonstrates advanced concepts including atomic state management with Jotai, 
          smooth page transitions with Framer Motion, type-safe routing with TanStack Router, and 
          comprehensive end-to-end testing with Playwright. Deployed on AWS with full CI/CD automation.
        </Text>

        <Heading as="h2" size="lg" mb={4} color="white">
          Technology Stack
        </Heading>
        
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6} mb={6}>
          {technologies.map((tech, index) => (
            <VStack
              key={index}
              bg="gray.900"
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.600"
              transition="all 0.2s"
              _hover={{ borderColor: "blue.400", transform: "translateY(-2px)" }}
            >
              <Box h="60px" w="60px" display="flex" alignItems="center" justifyContent="center">
                <Image 
                  src={tech.logo} 
                  alt={`${tech.name} logo`}
                  maxH="60px"
                  maxW="60px"
                  objectFit="contain"
                  fallback={
                    <Box 
                      bg="gray.700" 
                      h="60px" 
                      w="60px" 
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="xs" color="gray.400" textAlign="center">
                        {tech.name}
                      </Text>
                    </Box>
                  }
                />
              </Box>
              <VStack gap={1} textAlign="center">
                <Text fontSize="sm" fontWeight="semibold" color="white">
                  {tech.name}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {tech.description}
                </Text>
              </VStack>
            </VStack>
          ))}
        </SimpleGrid>

        <Heading as="h2" size="lg" mb={4} color="white">
          Architecture Highlights
        </Heading>
        
        <VStack align="start" gap={3} mb={6}>
          <HStack>
            <Text color="blue.400" fontWeight="bold">•</Text>
            <Text color="gray.300">
              <strong>Bulletproof React Structure:</strong> Scalable folder organization with feature-based modules
            </Text>
          </HStack>
          <HStack>
            <Text color="blue.400" fontWeight="bold">•</Text>
            <Text color="gray.300">
              <strong>Multi-stage Docker Build:</strong> Optimized production images with Nginx serving
            </Text>
          </HStack>
          <HStack>
            <Text color="blue.400" fontWeight="bold">•</Text>
            <Text color="gray.300">
              <strong>AWS Cloud Native:</strong> ECS Fargate with Application Load Balancer and SSL
            </Text>
          </HStack>
          <HStack>
            <Text color="blue.400" fontWeight="bold">•</Text>
            <Text color="gray.300">
              <strong>Full CI/CD Pipeline:</strong> GitHub Actions with automated testing and deployment
            </Text>
          </HStack>
          <HStack>
            <Text color="blue.400" fontWeight="bold">•</Text>
            <Text color="gray.300">
              <strong>Infrastructure as Code:</strong> Terraform for reproducible AWS resource management
            </Text>
          </HStack>
        </VStack>
      </Box>
      
      <Center>
        <VStack gap={2}>
          <Text fontSize={"sm"} color="gray.500" fontStyle="italic">
            Production URL: <Text as="span" color="blue.400">https://helixium.nicholasfane.com</Text>
          </Text>
          <Text fontSize={"sm"} color="gray.500" fontStyle="italic">
            Built with ❤️ using React 19, TypeScript & Modern Web Technologies
          </Text>
        </VStack>
      </Center>
    </Flex>
  );
}

export default Index;
