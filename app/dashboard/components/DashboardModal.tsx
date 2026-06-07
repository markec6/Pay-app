"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

export function DashboardModal({
  open,
  children,
  onClose,
  titleId,
}: {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  titleId: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
