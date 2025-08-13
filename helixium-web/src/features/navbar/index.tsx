import { Box, Flex, HStack, IconButton, Stack, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

interface NavLinkProps {
  children: React.ReactNode;
  to: string;
}

const NavLink = ({ children, to }: NavLinkProps) => (
  <Link to={to}>
    {({ isActive }) => (
      <Box
        as="span"
        px={2}
        py={1}
        borderRadius="md"
        color={isActive ? "white" : "gray.200"}
        cursor="pointer"
        bg={isActive ? "gray.600" : "transparent"}
        aria-current={isActive ? "page" : undefined}
        _hover={{
          bg: isActive ? "gray.600" : "gray.700",
          color: "white",
        }}
        _active={{
          bg: "gray.600",
        }}
      >
        {children}
      </Box>
    )}
  </Link>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      as="header"
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
      role="banner"
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
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
          <HStack
            as={"nav"}
            gap={4}
            display={{ base: "none", md: "flex" }}
            role="navigation"
            aria-label="Desktop navigation menu"
          >
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/SampleFormRoute">Sample Form</NavLink>
          </HStack>
        </HStack>
      </Flex>

      {isOpen ? (
        <Box
          id="mobile-menu"
          pb={4}
          display={{ md: "none" }}
          role="navigation"
          aria-label="Mobile navigation menu"
        >
          <Stack as={"nav"} gap={4}>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/SampleFormRoute">Sample Form</NavLink>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
