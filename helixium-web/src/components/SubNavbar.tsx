import { Box, HStack, Text, Button, Separator } from "@chakra-ui/react";
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

/**
 * SubNavbar - A secondary navigation bar that appears on routes with sub-routes
 *
 * This component automatically detects the current route and displays relevant
 * sub-navigation options based on the route configuration.
 */
const SubNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Configuration for sub-navigation based on route prefixes
  const subNavConfig: SubNavConfig = {
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
  };

  // Determine which sub-nav to show based on current route
  const activeSubNav = useMemo(() => {
    for (const [routePrefix, navItems] of Object.entries(subNavConfig)) {
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
      top="64px" // Right below main navbar (64px height)
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
                <Button
                  size="sm"
                  variant={item.isActive ? "solid" : "ghost"}
                  colorScheme={item.isActive ? "blue" : "gray"}
                  disabled
                  opacity={0.5}
                  _hover={{}}
                >
                  {item.label}
                </Button>
              ) : (
                <Link to={item.path}>
                  <Button
                    size="sm"
                    variant={item.isActive ? "solid" : "ghost"}
                    colorScheme={item.isActive ? "blue" : "gray"}
                    _hover={{
                      bg: item.isActive ? undefined : "gray.700",
                    }}
                  >
                    {item.label}
                  </Button>
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
