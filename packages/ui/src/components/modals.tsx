import { Dialog } from "@base-ui/react";
import type { ReactNode } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<ModalSize, string> = {
  sm: "md:max-w-sm",
  md: "md:max-w-lg",
  lg: "md:max-w-2xl",
  xl: "md:max-w-4xl",
};

interface ModalProps {
  title?: string;
  trigger: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  description?: string;
  size?: ModalSize;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Modal({
  children,
  trigger,
  title,
  description,
  footer,
  size = "md",
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 h-dvh bg-black/20 transition-opacity duration-150" />
        <Dialog.Popup
          className={`fixed top-1/2 left-1/2 -mt-8 flex flex-col w-full max-w-[calc(100vw-3rem)] ${sizeClasses[size]} -translate-x-1/2 -translate-y-1/2 bg-tertiary shadow-md transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 rounded-lg`}
        >
          <div className="w-full p-4 border-b border-b-outline-gray/50 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              {title && <Dialog.Title>{title}</Dialog.Title>}
              {description && (
                <Dialog.Description className="text-sm">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x-icon lucide-x text-secondary"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Dialog.Close>
          </div>
          <div className="p-4">{children}</div>
          {footer && <div>{footer}</div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
