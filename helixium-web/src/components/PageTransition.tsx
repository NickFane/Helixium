import { motion, type Transition } from "framer-motion";
import { type ReactNode, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import DebugContainer from "@/features/development-tools";
import {
  AnimationSpeed,
  type AnimationSpeedType,
} from "@/features/development-tools/types";

interface PageTransitionProps {
  children: ReactNode;
}

const getTransition = (speed: AnimationSpeedType): Transition => {
  const durations = {
    [AnimationSpeed.SLOWER]: 1.5,
    [AnimationSpeed.SLOW]: 0.8,
    [AnimationSpeed.NORMAL]: 0.3,
  };

  return {
    type: "tween",
    ease: "easeInOut",
    duration: durations[speed],
  };
};

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeedType>(
    AnimationSpeed.NORMAL
  );

  const pageTransition = getTransition(animationSpeed);

  return (
    <>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={pageTransition}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </motion.div>

      {/* Debug Container */}
      <DebugContainer 
        onAnimationSpeedChange={setAnimationSpeed}
        currentAnimationSpeed={animationSpeed}
      >
        {/* Additional debug components can be added here */}
      </DebugContainer>
    </>
  );
}
