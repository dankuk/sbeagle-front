import { useState, useEffect } from "react";

export default function useElapsedTimer(active) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (active) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active]);

  return elapsedTime;
}
