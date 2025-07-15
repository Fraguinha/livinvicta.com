import { MobileContext } from "@/context/MobileContext";
import { useContext } from "react";

export function useMobile() {
  const context = useContext(MobileContext);
  if (!context) throw new Error("useMobile must be used within a MobileProvider");
  return context;
}
