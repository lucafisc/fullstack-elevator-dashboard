import { useEffect, useState } from "react";

export function useParentDimensions(elementId: string, dependency: unknown) {
  const [parentDimensions, setParentDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const getParentDimensions = () => {
      const parentElement = document.getElementById(elementId);
      if (parentElement) {
        setParentDimensions({
          width: parentElement.offsetWidth,
          height: parentElement.offsetHeight,
        });
      }
    };

    getParentDimensions();
    window.addEventListener("resize", getParentDimensions);

    return () => {
      window.removeEventListener("resize", getParentDimensions);
    };
  }, [elementId, dependency]);

  return parentDimensions;
}
