import { motion } from "framer-motion";

export function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-200 w-full flex-col items-center justify-center px-4 py-6 sm:p-4 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md space-y-8"
            >
                {children}
            </motion.div>
        </div>
    );
}
