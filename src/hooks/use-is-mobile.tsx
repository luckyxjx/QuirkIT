// /hooks/use-is-mobile.ts

'use client'; // This is crucial. It tells Next.js this code runs on the client (the browser).

import { useState, useEffect } from 'react';

// This is our custom hook. It's just a function.
// We can give it a 'breakpoint' argument, but we'll default it to 768px.
export function useIsMobile(breakpoint: number = 768): boolean {
  // 1. Create a state variable to hold the result (true or false).
  // We initialize it to `false` so that the desktop version is rendered on the server by default.
  const [isMobile, setIsMobile] = useState(false);

  // 2. Use the `useEffect` hook.
  // The code inside useEffect ONLY runs on the client (in the browser), never on the server.
  // This is the key to solving the problem.
  useEffect(() => {
    // 3. This is the function that checks the window width.
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // 4. Run the check once when the component first mounts in the browser.
    checkScreenSize();

    // 5. Add an event listener. This will re-run our check function
    // every time the user resizes their browser window.
    window.addEventListener('resize', checkScreenSize);

    // 6. This is a "cleanup" function.
    // It removes the event listener when the component is no longer on the screen
    // to prevent memory leaks.
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]); // The effect depends on the 'breakpoint' value.

  // 7. Finally, the hook returns the current value of our state variable.
  return isMobile;
}