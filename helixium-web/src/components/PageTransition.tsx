import { Box } from "@chakra-ui/react";
import { Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export default function PageTransition() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, update the path and fade in
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsVisible(true);
      }, 150); // Half of the total transition duration

      return () => clearTimeout(timer);
    }
  }, [location.pathname, currentPath]);

  return (
    <Box
      opacity={isVisible ? 1 : 0}
      transition="opacity 300ms ease-in-out"
      width="100%"
      height="100%"
    >
      <Outlet />
    </Box>
  );
}