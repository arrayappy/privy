import { useEffect, useState } from "react";
import useWindowDimensions from "src/hooks/useWindowDimensions";
import Breakpoints from "src/constants/Breakpoints";

type BreakpointKey = keyof typeof Breakpoints;
type BreakpointConfigKey = `is${BreakpointKey}Breakpoint`;
type BreakpointConfig = {
  [key in BreakpointConfigKey]: boolean;
};

const BreakpointList = Object.entries(Breakpoints) as Array<
  [BreakpointKey, number]
>;

function getBreakpointsFromWindowWidth(): BreakpointConfig {
  return BreakpointList.reduce((result, [breakpoint, size]) => {
    const { matches } = window.matchMedia(`(max-width: ${size}px)`);
    const key: BreakpointConfigKey = `is${breakpoint}Breakpoint`;
    return {
      ...result,
      [key]: matches,
    };
  }, {} as BreakpointConfig);
}

export default function useBreakpoint() {
  const { width } = useWindowDimensions();
  const [breakpoints, setBreakpoints] = useState(
    getBreakpointsFromWindowWidth()
  );

  useEffect(() => {
    setBreakpoints(getBreakpointsFromWindowWidth());
  }, [width]);

  return breakpoints;
}
