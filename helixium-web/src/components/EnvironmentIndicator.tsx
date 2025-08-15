import { Box, Text } from "@chakra-ui/react";
import { getRuntimeConfig } from "@/utils/runtime-config";

/**
 * Environment Indicator Component
 * Shows the current deployment environment at the bottom of the page
 * Helps with debugging environment variable injection
 */
export default function EnvironmentIndicator() {
  const config = getRuntimeConfig();
  
  // Get additional debug info
  const debugInfo = {
    deploymentEnv: config.DEPLOYMENT_ENV,
    hasRuntimeConfig: typeof window !== 'undefined' && !!window.__RUNTIME_CONFIG__,
    runtimeConfigValue: typeof window !== 'undefined' && window.__RUNTIME_CONFIG__ 
      ? window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV 
      : 'N/A',
    viteRuntimeEnv: import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV || 'N/A',
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE || 'N/A'
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="rgba(0, 0, 0, 0.8)"
      color="white"
      p={2}
      fontSize="xs"
      fontFamily="monospace"
      zIndex={9999}
      borderTop="1px solid"
      borderColor="gray.600"
    >
      <Text textAlign="center">
        ENV: {config.DEPLOYMENT_ENV} | 
        Runtime: {debugInfo.runtimeConfigValue} | 
        Vite: {debugInfo.viteRuntimeEnv} | 
        Mode: {debugInfo.mode} | 
        Dev: {debugInfo.isDev ? 'true' : 'false'} | 
        HasRuntime: {debugInfo.hasRuntimeConfig ? 'true' : 'false'}
      </Text>
    </Box>
  );
}