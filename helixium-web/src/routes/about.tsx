import { Center, Flex, Text, Box, Heading } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <Flex flexDir={"column"} gap={6} maxW="800px" w="100%">
      <Center>
        <Heading as="h1" size="xl" mb={4}>
          About Helixium
        </Heading>
      </Center>
      
      <Box bg="gray.800" p={6} borderRadius="lg" border="1px solid" borderColor="gray.700">
        <Text fontSize={"lg"} color="gray.100" mb={4}>
          Welcome to Helixium - A Modern Web Application
        </Text>
        
        <Text color="gray.300" lineHeight="1.6" mb={4}>
          Helixium is a cutting-edge web application built with the latest technologies 
          to provide an exceptional user experience. Our platform combines modern design 
          principles with powerful functionality to deliver solutions that meet your needs.
        </Text>
        
        <Text color="gray.300" lineHeight="1.6" mb={4}>
          Built with React, TypeScript, and Chakra UI, Helixium leverages state-of-the-art 
          tools and frameworks to ensure reliability, performance, and scalability.
        </Text>
        
        <Text color="gray.300" lineHeight="1.6">
          This is placeholder content for the About page. Replace this with your actual 
          company information, mission statement, team details, or any other relevant 
          content that describes your application or organization.
        </Text>
      </Box>
      
      <Center>
        <Text fontSize={"sm"} color="gray.500" fontStyle="italic">
          Version 1.0.0 | Built with ❤️ using React & Chakra UI
        </Text>
      </Center>
    </Flex>
  );
}

export default About;