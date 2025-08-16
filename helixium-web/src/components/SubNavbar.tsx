import { Box, HStack } from "@chakra-ui/react";
import { Link, useLocation } from "@tanstack/react-router";
import { useMemo } from "react";

interface SubNavItem {
  label: string;
  path: string;
  isActive?: boolean;
  isDisabled?: boolean;
}

interface SubNavConfig {
  [routePrefix: string]: SubNavItem[];
}

// Configuration for sub-navigation based on route prefixes
const getSubNavConfig = (currentPath: string): SubNavConfig => ({
  "/form-builder": [
    {
      label: "Overview",
      path: "/form-builder",
      isActive:
        currentPath === "/form-builder" || currentPath === "/form-builder/",
    },
    {
      label: "Demos",
      path: "/form-builder/demos/gene-reusability", // Link to first available demo
      isActive: currentPath.startsWith("/form-builder/demos"),
    },
    {
      label: "Utilities",
      path: "/form-builder/utilities",
      isActive: currentPath.startsWith("/form-builder/utilities"),
      isDisabled: true, // Not implemented yet
    },
  ],
});

/**
 * SubNavbar - A secondary navigation bar that appears on routes with sub-routes
 *
 * This component automatically detects the current route and displays relevant
 * sub-navigation options based on the route configuration.
 */
const SubNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which sub-nav to show based on current route
  const activeSubNav = useMemo(() => {
    for (const [routePrefix, navItems] of Object.entries(
      getSubNavConfig(currentPath)
    )) {
      if (currentPath.startsWith(routePrefix)) {
        return navItems;
      }
    }
    return null;
  }, [currentPath]);

  // Don't render if no matching sub-nav configuration
  if (!activeSubNav) {
    return null;
  }

  return (
    <Box
      as="nav"
      bg="#1a1a1a"
      borderBottom="1px solid"
      borderColor="gray.700"
      position="fixed"
      top="calc(var(--navbar-height, 64px))"
      left={0}
      right={0}
      zIndex={999} // Lower than main navbar (1000)
      px={4}
      h={12} // 48px height
      role="navigation"
      aria-label="Sub navigation"
    >
      <Box maxW="1200px" mx="auto" h="full">
        <HStack gap={1} h="full" alignItems="center">
          {activeSubNav.map((item, index) => (
            <Box key={index}>
              {item.isDisabled ? (
                <Box
                  as="span"
                  px={3}
                  py={2}
                  borderRadius="md"
                  color="gray.500"
                  fontSize="sm"
                  fontWeight="medium"
                  opacity={0.6}
                  cursor="not-allowed"
                >
                  {item.label}
                </Box>
              ) : (
                <Link to={item.path}>
                  <Box
                    as="button"
                    role="button"
                    px={3}
                    py={2}
                    borderRadius="md"
                    color={item.isActive ? "white" : "gray.200"}
                    fontSize="sm"
                    fontWeight="medium"
                    cursor="pointer"
                    bg={item.isActive ? "gray.600" : "transparent"}
                    _hover={{
                      bg: item.isActive ? "gray.600" : "gray.700",
                      color: "white",
                    }}
                    _active={{
                      bg: "gray.600",
                    }}
                    transition="all 0.2s"
                    border="none"
                    outline="none"
                    _focus={{
                      outline: "2px solid",
                      outlineColor: "blue.400",
                      outlineOffset: "2px",
                    }}
                  >
                    {item.label}
                  </Box>
                </Link>
              )}
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};

export default SubNavbar;
