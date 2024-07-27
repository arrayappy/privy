import { useEffect, useState } from "react";

export default function useIsSsr() {
  const [isSsr, setIsSsr] = useState(true);
  useEffect(() => setIsSsr(false), []);
  return isSsr;
}
