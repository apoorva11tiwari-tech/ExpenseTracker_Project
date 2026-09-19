import { useState, useEffect } from "react";

// Makes animation smooth
function easeOut(value) {
  return 1 - Math.pow(1 - value, 3);
}


// Count from 0 to target
export function useCountUp(target, duration = 1200, delay = 0) {

  const [count, setCount] = useState(0);

  useEffect(() => {

    const timer = setTimeout(() => {

      const startTime = Date.now();

      function updateNumber() {

        const timePassed = Date.now() - startTime;

        let progress = timePassed / duration;

        if (progress > 1) {
          progress = 1;
        }

        const currentNumber =
          target * easeOut(progress);

        setCount(Math.round(currentNumber));

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }

      requestAnimationFrame(updateNumber);

    }, delay);

    return () => {
      clearTimeout(timer);
    };

  }, [target, duration, delay]);

  return count;
}


// Fade-in animation
export function useFadeIn(delay = 50) {

  const [visible, setVisible] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };

  }, [delay]);

  return visible;
}