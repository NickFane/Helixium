/**
 * Runtime configuration utility
 * Handles environment variables that are injected at runtime, not build time
 */

interface RuntimeConfig {
  DEPLOYMENT_ENV: string;
}

/**
 * Get runtime configuration
 * Priority order:
 * 1. Runtime injected config (production deployments)
 * 2. Vite environment variables (development)
 * 3. Development mode fallback
 * 4. Production fallback
 */
export const getRuntimeConfig = (): RuntimeConfig => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Production: try to read from injected runtime config
    if (window.__RUNTIME_CONFIG__ && 
        typeof window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV === 'string' &&
        window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV.trim() !== '' &&
        window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV !== '{{DEPLOYMENT_ENV}}') {
      
      const deploymentEnv = window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV.trim();
      console.log(`[RuntimeConfig] Using runtime config: ${deploymentEnv}`);
      
      return {
        DEPLOYMENT_ENV: deploymentEnv
      };
    } else if (window.__RUNTIME_CONFIG__) {
      console.warn('[RuntimeConfig] Runtime config exists but DEPLOYMENT_ENV is invalid:', {
        value: window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV,
        type: typeof window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV,
        isPlaceholder: window.__RUNTIME_CONFIG__.DEPLOYMENT_ENV === '{{DEPLOYMENT_ENV}}'
      });
    }
    
    // Development/Test: Check for explicit environment variable first
    if (import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV) {
      console.log(`[RuntimeConfig] Using Vite env: ${import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV}`);
      return {
        DEPLOYMENT_ENV: import.meta.env.VITE_RUNTIME_DEPLOYMENT_ENV
      };
    }
    
    // In development mode (Vite dev server), always show debug tools
    if (import.meta.env.DEV) {
      console.log('[RuntimeConfig] Using dev mode fallback');
      return {
        DEPLOYMENT_ENV: 'dev'
      };
    }
  }
  
  // Fallback to safe default for production builds
  console.log('[RuntimeConfig] Using production fallback');
  return {
    DEPLOYMENT_ENV: 'prod'
  };
};

/**
 * Check if debug tools should be shown
 * Returns true if DEPLOYMENT_ENV is 'dev'
 */
export const shouldShowDebugTools = (): boolean => {
  const config = getRuntimeConfig();
  const result = config.DEPLOYMENT_ENV === 'dev';
  console.log(`[RuntimeConfig] Debug tools: ${result ? 'ENABLED' : 'DISABLED'} (env: ${config.DEPLOYMENT_ENV})`);
  return result;
};