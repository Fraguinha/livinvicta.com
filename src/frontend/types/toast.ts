import type { ToastActionElement, ToastProps } from "@/components/ui/toast"
import * as React from "react"

export interface ToasterToast extends Omit<ToastProps, "title" | "description"> {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export interface ToastState {
  toasts: ToasterToast[]
}

export type ToastAction =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: ToasterToast["id"]
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: ToasterToast["id"]
    }

export type Toast = Omit<ToasterToast, "id">
