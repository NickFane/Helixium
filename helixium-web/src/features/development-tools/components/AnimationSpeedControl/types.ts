export const AnimationSpeed = {
    SLOWER: "slower",
    SLOW: "slow",
    NORMAL: "normal",
} as const;

export type AnimationSpeed = typeof AnimationSpeed[keyof typeof AnimationSpeed];

export interface AnimationSpeedControlProps {
    onSpeedChange?: (speed: AnimationSpeed) => void;
    speed?: AnimationSpeed;
}
