// Re-export constants and types from individual components for convenience
export { AnimationSpeed } from "./components/AnimationSpeedControl/types";
export type { AnimationSpeed as AnimationSpeedType } from "./components/AnimationSpeedControl/types";

// Shared debug types can be added here as the system grows
export interface DebugComponentProps {
    isVisible?: boolean;
    onToggle?: () => void;
}
