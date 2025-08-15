declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      DEPLOYMENT_ENV: string;
    };
  }
}

export {};