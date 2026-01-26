import React from "react";
import { motion } from "framer-motion";

export default function EmptyCustomer() {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src="/Customer-Service-removebg-preview.png"
        alt="No customer found"
        className="w-52 md:w-72 max-w-full"
      />

      <div>
        <h2 className="text-xl md:text-2xl font-bold text-emerald-900">
          No Customer Found here!
        </h2>

        <p className="mt-2 text-emerald-800/70 max-w-md text-sm md:text-base">
          There are currently no customers in the system. Please check back
          later or add a new customer to get started 🚀
        </p>
      </div>
    </motion.div>
  );
}
