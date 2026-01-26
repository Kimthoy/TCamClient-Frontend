import React from "react";
import { motion } from "framer-motion";

export default function EmptyPartner() {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-center justify-center text-center "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src="/partner.png"
        alt="No partner available"
        className="w-52 md:w-72 max-w-full"
      />

      <div>
        <h2 className="text-xl md:text-2xl font-bold text-emerald-900">
          No Partner Available
        </h2>

        <p className="mt-2 text-emerald-800/70 max-w-md text-sm md:text-base">
          We don’t have any partners available at the moment. Please check back
          later — we’re always planning something new 🚀
        </p>
      </div>
    </motion.div>
  );
}
