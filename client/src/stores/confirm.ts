import { reactive } from "vue";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: "danger" | "warning" | "info";
  resolve: ((value: boolean) => void) | null;
}

export const confirm = reactive<
  ConfirmState & {
    show: (options: ConfirmOptions) => Promise<boolean>;
    close: (result: boolean) => void;
  }
>({
  isOpen: false,
  title: "Confirm",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  type: "danger",
  resolve: null,

  show(options: ConfirmOptions): Promise<boolean> {
    this.isOpen = true;
    this.title = options.title || "Confirm";
    this.message = options.message;
    this.confirmText = options.confirmText || "Confirm";
    this.cancelText = options.cancelText || "Cancel";
    this.type = options.type || "danger";

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  },

  close(result: boolean) {
    this.isOpen = false;
    if (this.resolve) {
      this.resolve(result);
      this.resolve = null;
    }
  },
});
