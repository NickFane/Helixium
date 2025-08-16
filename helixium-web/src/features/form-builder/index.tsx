import { Box, Heading, Text } from "@chakra-ui/react";

const FormBuilder = () => {
  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading size="lg" color="white" mb={4}>
        🛠️ Form Builder
      </Heading>
      <Text color="gray.300" fontSize="md">
        Premium feature coming soon - this will be the foundation for
        configurable journey workflows.
      </Text>
    </Box>
  );
};

export default FormBuilder;
