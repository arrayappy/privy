import { useEffect, useState } from "react";

type Props = {
  children: any;
};

// We only need this to happen once, and not every time
// the children get re-rendered (e.g. if you nav from one page
// to another)
let isShownGlobal = false;

// Delay render so that we know whether the wallet is
// connected or not
export default function DelayRender({ children }: Props) {
  const [isShown, setIsShown] = useState(isShownGlobal);
  useEffect(() => {
    setTimeout(() => {
      setIsShown(true);
      isShownGlobal = true;
    }, 100);
  }, []);

  if (!isShown) {
    return null;
  }
  return children;
}
