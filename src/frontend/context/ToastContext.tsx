import { toast as toastFn, useToast as useToastHook } from "@/hooks/use-toast";
import { createContext, ReactNode, useContext } from "react";

const ToastContext = createContext<ReturnType<typeof useToastHook> | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToastHook();
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
export { toastFn as toast };
