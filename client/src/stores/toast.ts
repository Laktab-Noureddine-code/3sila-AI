import { reactive } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

export const toast = reactive({
  toasts: [] as Toast[],
  nextId: 1,

  // Show a toast notification
  show(message: string, type: ToastType = "info", duration: number = 8000) {
    const id = this.nextId++;
    const newToast: Toast = {
      id,
      message,
      type,
      duration,
    };

    this.toasts.push(newToast);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  },

  // Convenience methods
  success(message: string, duration?: number) {
    return this.show(message, "success", duration);
  },

  error(message: string, duration?: number) {
    return this.show(message, "error", duration);
  },

  warning(message: string, duration?: number) {
    return this.show(message, "warning", duration);
  },

  info(message: string, duration?: number) {
    return this.show(message, "info", duration);
  },

  // Remove a specific toast
  remove(id: number) {
    const index = this.toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.toasts.splice(index, 1);
    }
  },

  // Clear all toasts
  clear() {
    this.toasts = [];
  },
});
