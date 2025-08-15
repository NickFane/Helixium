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
 * In development: reads from process.env (Vite dev server)
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
    
    // Development: Vite injects process.env into import.meta.env
    // We use a special prefix for runtime variables
    if (import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV) {
      return {
        DEPLOYMENT_ENV: import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV
      };
    }
  }
  
  // Fallback to safe default
  return {
    DEPLOYMENT_ENV: 'prod'
  };
};

/**
 * Check if debug tools should be shown
 */
export const shouldShowDebugTools = (): boolean => {
  const config = getRuntimeConfig();
  return config.DEPLOYMENT_ENV === 'dev';
};