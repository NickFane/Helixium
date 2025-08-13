import {
  Box,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
}

const NavLink = ({ children, to }: NavLinkProps) => (
  <Link to={to}>
    <ChakraLink
      px={2}
      py={1}
      rounded={"md"}
      color="gray.200"
      _hover={{
        textDecoration: "none",
        bg: "gray.700",
        color: "white",
      }}
    >
      {children}
    </ChakraLink>
  </Link>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      bg="#1a1a1a"
      px={4}
      shadow="lg"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      borderBottom="1px solid"
      borderColor="gray.700"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </IconButton>

        <HStack gap={8} alignItems={"center"}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" color="white">
              Helixium
            </Text>
          </Box>
          <HStack as={"nav"} gap={4} display={{ base: "none", md: "flex" }}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/SampleFormRoute">Sample Form</NavLink>
          </HStack>
        </HStack>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} gap={4}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/SampleFormRoute">Sample Form</NavLink>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
