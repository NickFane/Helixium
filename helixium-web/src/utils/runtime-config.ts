/**
 * Runtime configuration utility
 * Handles environment variables that are injected at runtime, not build time
 */

interface RuntimeConfig {
  DEPLOYMENT_ENV: string;
}

/**
 * Get runtime configuration
 * In production: reads from window.__RUNTIME_CONFIG__ (injected by entrypoint script)
 * In development: always shows debug tools (includes tests)
 */
export const getRuntimeConfig = (): RuntimeConfig => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Production: try to read from injected runtime config
    if (window.__RUNTIME_CONFIG__) {
      return {
        DEPLOYMENT_ENV: window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV || 'prod'
      };
    }
    
    // Development/Test: Check for explicit environment variable first
    if (import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV) {
      return {
        DEPLOYMENT_ENV: import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV
      };
    }
    
    // In development mode (including tests), always show debug tools
    // This ensures tests pass and provides a good development experience
    if (import.meta.env.DEV) {
      return {
        DEPLOYMENT_ENV: 'dev'
      };
    }
  }
  
  // Fallback to safe default for production builds
  return {
    DEPLOYMENT_ENV: 'prod'
  };
};

/**
 * Check if debug tools should be shown
 * - Production builds with runtime injection: controlled by DEPLOYMENT_ENV
 * - Development builds (including tests): always shown
 */
export const shouldShowDebugTools = (): boolean => {
  const config = getRuntimeConfig();
  return config.DEPLOYMENT_ENV === 'dev';
};