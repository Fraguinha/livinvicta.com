import type { MobileContextType } from "@/types/context-types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const MobileProvider = ({ children }: { children: ReactNode }) => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MobileContext.Provider value={{ isMobile }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) throw new Error("useMobile must be used within a MobileProvider");
  return context;
};
